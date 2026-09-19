import type { APIRoute } from "astro";
import { requireRole, logAuditEvent } from "@/lib/auth";
import { createApiSupabase } from "@/lib/supabase";
import {
  computeSha256,
  fromPaise,
  parseStatementFile,
  reconcileStatement,
  toPaise,
  filterTransactionsByDateRange,
} from "@/lib/finance-engine";

export const POST: APIRoute = async ({ request }) => {
  const authResult = await requireRole(request, ["ADMIN", "SUPER_ADMIN"]);
  if ("response" in authResult) return authResult.response;
  const { ctx } = authResult;

  try {
    const scopedSupabase = createApiSupabase(ctx.token);
    if (!scopedSupabase) {
      return new Response(JSON.stringify({ error: "Database unavailable" }), { status: 500 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const periodId = (formData.get("reporting_period_id") || formData.get("period_id")) as string | null;

    if (!file || !periodId) {
      return new Response(
        JSON.stringify({ error: "Statement file and reporting_period_id (or period_id) are required" }),
        { status: 400 }
      );
    }

    // 1. Fetch reporting period
    const { data: period, error: periodErr } = await scopedSupabase
      .from("reporting_periods")
      .select("*")
      .eq("id", periodId)
      .single();

    if (periodErr || !period) {
      return new Response(JSON.stringify({ error: "Reporting period not found" }), { status: 404 });
    }

    if (period.status === "PUBLISHED") {
      return new Response(
        JSON.stringify({
          error: "Reporting period is already published. Published periods are immutable. Create an audit correction record if changes are required.",
        }),
        { status: 403 }
      );
    }

    // 2. Compute real raw byte SHA-256 hash
    const arrayBuffer = await file.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    const fileSha256 = await computeSha256(bytes);
    const fileName = file.name;
    const fileType = fileName.toLowerCase().endsWith(".pdf") ? "pdf" : "csv";

    // 3. Upload file bytes to private bucket 'bank-statements'
    const storagePath = `statements/${periodId}/${fileSha256}.${fileType}`;
    const { error: uploadError } = await scopedSupabase.storage
      .from("bank-statements")
      .upload(storagePath, bytes, {
        contentType: fileType === "pdf" ? "application/pdf" : "text/csv",
        upsert: true,
      });

    if (uploadError) {
      console.warn("Storage upload warning (continuing with database record):", uploadError.message);
    }

    // 4. Create bank_statements record
    const { data: statementRecord, error: stmtInsertErr } = await scopedSupabase
      .from("bank_statements")
      .insert({
        reporting_period_id: periodId,
        original_filename: fileName,
        storage_path: storagePath,
        file_type: fileType,
        file_size_bytes: file.size,
        file_sha256: fileSha256,
        bank_name: "Axis Bank",
        account_number_masked: "XXXXXXXXX37387",
        parser_status: "PENDING",
        uploaded_by: ctx.user.id,
      })
      .select()
      .single();

    if (stmtInsertErr || !statementRecord) {
      throw stmtInsertErr || new Error("Failed to insert statement record");
    }

    // 5. Read text content and parse transactions
    let textContent = "";
    if (fileType === "csv") {
      const decoder = new TextDecoder("utf-8");
      textContent = decoder.decode(bytes);
    } else {
      try {
        const { extractText } = await import("unpdf");
        const pdfRes = await extractText(bytes);
        textContent = Array.isArray(pdfRes.text) ? pdfRes.text.join("\n") : String(pdfRes.text || "");
      } catch (pdfErr) {
        console.warn("unpdf extraction failed, falling back to decoder:", pdfErr);
        const decoder = new TextDecoder("latin1");
        textContent = decoder.decode(bytes);
      }
    }

    const parseResult = await parseStatementFile(textContent, fileType);

    // Filter rows strictly belonging to this 6-month reporting period
    const periodRows = filterTransactionsByDateRange(
      parseResult.transactions,
      period.start_date,
      period.end_date
    );

    if (periodRows.length === 0 && parseResult.transactions.length > 0) {
      // If none matched date filter, fallback to all parsed rows with warning
      console.warn("No transactions strictly inside date bounds, using parsed rows");
    }
    const finalRows = periodRows.length > 0 ? periodRows : parseResult.transactions;

    // 6. Duplicate detection against existing database records
    const fingerprints = finalRows.map((r) => r.fingerprint);
    const { data: existingFingerprints } = await scopedSupabase
      .from("financial_transactions")
      .select("id, fingerprint, reference_utr, amount, transaction_date")
      .in("fingerprint", fingerprints);

    const existingFpMap = new Map((existingFingerprints || []).map((e) => [e.fingerprint, e]));

    // Check UTR duplicates as well
    const utrs = finalRows.map((r) => r.reference_utr).filter(Boolean) as string[];
    let existingUtrMap = new Map<string, { id: string; reporting_period_id: string }>();
    if (utrs.length > 0) {
      const { data: existingUtrs } = await scopedSupabase
        .from("financial_transactions")
        .select("id, reference_utr, reporting_period_id")
        .in("reference_utr", utrs);
      existingUtrMap = new Map((existingUtrs || []).map((e) => [e.reference_utr, e]));
    }

    // Delete existing unverified extracted transactions for this statement/period to allow clean re-upload
    await scopedSupabase
      .from("financial_transactions")
      .delete()
      .eq("reporting_period_id", periodId)
      .eq("verification_status", "EXTRACTED");

    // 7. Insert extracted transaction records
    const dbTransactions = finalRows.map((row) => {
      const hasExactFp = existingFpMap.has(row.fingerprint);
      const existingUtr = row.reference_utr ? existingUtrMap.get(row.reference_utr) : null;
      const isDuplicate = hasExactFp || Boolean(existingUtr && existingUtr.reporting_period_id !== periodId);
      const duplicateWarning = hasExactFp
        ? "Identical transaction fingerprint found in database"
        : existingUtr
        ? `Matching bank reference/UTR ${row.reference_utr} found in database`
        : null;

      return {
        statement_id: null,
        bank_statement_id: statementRecord.id,
        reporting_period_id: periodId,
        transaction_date: row.transaction_date,
        value_date: row.value_date || row.transaction_date,
        transaction_type: row.direction === "CR" ? "CONTRIBUTION" : "EXPENSE",
        category: row.classification,
        classification: row.classification,
        amount: fromPaise(row.amount_paise || (row.direction === "CR" ? row.credit_paise : row.debit_paise)),
        debit: fromPaise(row.debit_paise),
        credit: fromPaise(row.credit_paise),
        balance_after_transaction: row.balance_after_paise ? fromPaise(row.balance_after_paise) : null,
        description: row.description,
        reference_utr: row.reference_utr || null,
        fingerprint: row.fingerprint,
        duplicate_group: isDuplicate ? (row.reference_utr || row.fingerprint) : null,
        is_duplicate_flag: isDuplicate,
        duplicate_warning: duplicateWarning,
        verification_status: "EXTRACTED",
        public_visibility: true,
        source_row: row.source_row,
      };
    });

    if (dbTransactions.length > 0) {
      const { error: insertErr } = await scopedSupabase
        .from("financial_transactions")
        .insert(dbTransactions);
      if (insertErr) throw insertErr;
    }

    // 8. Update statement parser status
    await scopedSupabase
      .from("bank_statements")
      .update({
        parser_status: "PARSED",
        extracted_row_count: dbTransactions.length,
      })
      .eq("id", statementRecord.id);

    // 9. Exact Paise Reconciliation for the Reporting Period
    let totalCreditsPaise = 0n;
    let totalDebitsPaise = 0n;
    for (const r of finalRows) {
      totalCreditsPaise += r.credit_paise;
      totalDebitsPaise += r.debit_paise;
    }

    const openingPaise = toPaise(period.opening_balance);
    const expectedClosingPaise = finalRows.length > 0 && finalRows[finalRows.length - 1].balance_after_paise !== undefined
      ? (finalRows[finalRows.length - 1].balance_after_paise as bigint)
      : openingPaise + totalCreditsPaise - totalDebitsPaise;

    const recon = reconcileStatement({
      opening_balance_paise: openingPaise,
      total_credits_paise: totalCreditsPaise,
      total_debits_paise: totalDebitsPaise,
      expected_closing_paise: expectedClosingPaise,
    });

    // Update reporting period with verified totals and reconciliation outcome
    await scopedSupabase
      .from("reporting_periods")
      .update({
        status: recon.is_matched ? "EXTRACTED" : "RECONCILIATION_FAILED",
        total_credits: fromPaise(totalCreditsPaise),
        total_debits: fromPaise(totalDebitsPaise),
        closing_balance: fromPaise(expectedClosingPaise),
        calculated_closing_balance: fromPaise(recon.calculated_closing_paise),
        reconciliation_difference: fromPaise(recon.difference_paise),
        reconciliation_status: recon.status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", periodId);

    // Log audit event
    await logAuditEvent({
      actorUserId: ctx.user.id,
      actorRole: ctx.profile.role,
      action: "BANK_STATEMENT_UPLOADED",
      entityType: "BANK_STATEMENT",
      entityId: statementRecord.id,
      metadata: {
        filename: fileName,
        fileSha256,
        extractedCount: dbTransactions.length,
        reconciliation: recon.status,
        difference: recon.difference_formatted,
      },
    });

    return new Response(
      JSON.stringify({
        success: true,
        extracted_count: dbTransactions.length,
        parsed_count: dbTransactions.length,
        statement: {
          id: statementRecord.id,
          filename: fileName,
          fileSha256,
          extracted_count: dbTransactions.length,
        },
        reconciliation: {
          opening: fromPaise(openingPaise),
          total_credits: fromPaise(totalCreditsPaise),
          total_debits: fromPaise(totalDebitsPaise),
          expected_closing: fromPaise(expectedClosingPaise),
          calculated_closing: fromPaise(recon.calculated_closing_paise),
          difference: recon.difference_formatted,
          is_matched: recon.is_matched,
          status: recon.status,
        },
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err: unknown) {
    console.error("Statement upload error:", err);
    const msg = err instanceof Error ? err.message : "Failed to process statement upload";
    return new Response(JSON.stringify({ error: msg }), { status: 500 });
  }
};
