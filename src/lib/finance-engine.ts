// ============================================================================
// NAGRIK PARTY: FINANCIAL RECONCILIATION & STATEMENT INGESTION ENGINE
// Exact Paise Integer Arithmetic (Zero IEEE-754 floating-point error)
// ============================================================================

export interface ParsedTransactionRow {
  transaction_date: string; // YYYY-MM-DD
  value_date?: string;      // YYYY-MM-DD
  description: string;
  reference_utr?: string;
  amount_paise?: bigint;
  direction?: "CR" | "DR";
  debit_paise: bigint;
  credit_paise: bigint;
  balance_after_paise?: bigint;
  branch_name?: string;
  classification?: string;
  fingerprint?: string;
  source_row?: Record<string, unknown>;
}

export interface ParsedStatementResult {
  account_number: string;
  account_holder?: string;
  period_start?: string; // YYYY-MM-DD
  period_end?: string;   // YYYY-MM-DD
  opening_balance_paise: bigint;
  closing_balance_paise: bigint;
  total_credits_paise: bigint;
  total_debits_paise: bigint;
  transactions: ParsedTransactionRow[];
}

export interface ReconciliationResult {
  opening_paise: bigint;
  total_credits_paise: bigint;
  total_debits_paise: bigint;
  expected_closing_paise: bigint;
  calculated_closing_paise: bigint;
  difference_paise: bigint;
  is_matched: boolean;
  status: "MATCHED" | "FAILED";
  difference_formatted: string;
}

export interface ContinuityResult {
  previous_period_id?: string;
  previous_closing_paise: bigint;
  current_opening_paise: bigint;
  difference_paise: bigint;
  is_continuous: boolean;
  status: "CONTINUOUS" | "MISMATCH" | "NOT_APPLICABLE";
}

// ----------------------------------------------------------------------------
// EXACT PAISE ARITHMETIC UTILITIES
// ----------------------------------------------------------------------------

/**
 * Converts a decimal string or number to integer paise BigInt.
 * Handles "20000.00", ".85", "1", "100.5", "-45.00" without float precision loss.
 */
export function toPaise(val: string | number | null | undefined): bigint {
  if (val === null || val === undefined) return 0n;
  const str = String(val).trim().replace(/,/g, "");
  if (!str || str === "-" || str === ".") return 0n;

  const isNegative = str.startsWith("-");
  const cleanStr = isNegative ? str.slice(1) : str;

  const parts = cleanStr.split(".");
  const wholeStr = parts[0] || "0";
  const whole = BigInt(wholeStr);

  let fracStr = parts[1] || "";
  if (fracStr.length === 0) {
    fracStr = "00";
  } else if (fracStr.length === 1) {
    fracStr = fracStr + "0";
  } else if (fracStr.length > 2) {
    // Truncate beyond paise (cents)
    fracStr = fracStr.slice(0, 2);
  }
  const frac = BigInt(fracStr);

  const total = whole * 100n + frac;
  return isNegative ? -total : total;
}

/**
 * Formats integer paise BigInt back to standard 2-decimal string e.g. "20000.00"
 */
export function fromPaise(paise: bigint): string {
  const isNegative = paise < 0n;
  const abs = isNegative ? -paise : paise;
  const whole = abs / 100n;
  const frac = abs % 100n;
  const fracStr = frac < 10n ? `0${frac}` : String(frac);
  return `${isNegative ? "-" : ""}${whole}.${fracStr}`;
}

/**
 * Formats paise into Indian Rupee currency format (e.g. ₹20,649.01)
 */
export function formatPaiseInr(paise: bigint, showSymbol = true): string {
  const isNegative = paise < 0n;
  const abs = isNegative ? -paise : paise;
  const whole = abs / 100n;
  const frac = abs % 100n;
  const fracStr = frac < 10n ? `0${frac}` : String(frac);

  // Indian number grouping: last 3 digits, then groups of 2 digits
  const wholeStr = String(whole);
  let formattedWhole = "";
  if (wholeStr.length <= 3) {
    formattedWhole = wholeStr;
  } else {
    const last3 = wholeStr.slice(-3);
    const rest = wholeStr.slice(0, -3);
    const parts: string[] = [];
    for (let i = rest.length; i > 0; i -= 2) {
      const start = Math.max(0, i - 2);
      parts.unshift(rest.slice(start, i));
    }
    formattedWhole = parts.join(",") + "," + last3;
  }

  const prefix = isNegative ? "-" : "";
  const symbol = showSymbol ? "₹" : "";
  return `${prefix}${symbol}${formattedWhole}.${fracStr}`;
}

// ----------------------------------------------------------------------------
// CRYPTOGRAPHIC HASH & FINGERPRINTING
// ----------------------------------------------------------------------------

/**
 * Computes SHA-256 hex string from ArrayBuffer or Uint8Array.
 */
export async function computeSha256(data: ArrayBuffer | Uint8Array): Promise<string> {
  const hashBuffer = await crypto.subtle.digest("SHA-256", data as ArrayBuffer);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Computes deterministic SHA-256 transaction fingerprint.
 */
export async function computeTransactionFingerprint(params: {
  transaction_date: string;
  direction: "CR" | "DR";
  amount_paise: bigint;
  reference_utr?: string;
  description: string;
  account_number?: string;
}): Promise<string> {
  const normDate = params.transaction_date.trim();
  const normDir = params.direction.toUpperCase().trim();
  const normAmount = params.amount_paise.toString();
  const normRef = (params.reference_utr || "").trim().toUpperCase();
  const normDesc = params.description.trim().toLowerCase().replace(/\s+/g, " ");
  const normAcc = (params.account_number || "").trim().slice(-6);

  const payload = `${normDate}|${normDir}|${normAmount}|${normRef}|${normDesc}|${normAcc}`;
  const encoder = new TextEncoder();
  return computeSha256(encoder.encode(payload));
}

// ----------------------------------------------------------------------------
// DATE NORMALIZATION (DD-MM-YYYY -> YYYY-MM-DD)
// ----------------------------------------------------------------------------

export function normalizeDate(dateStr: string): string {
  const clean = dateStr.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(clean)) return clean;
  // Match DD-MM-YYYY or DD/MM/YYYY
  const parts = clean.split(/[-/]/);
  if (parts.length === 3) {
    if (parts[0].length === 2 && parts[2].length === 4) {
      return `${parts[2]}-${parts[1].padStart(2, "0")}-${parts[0].padStart(2, "0")}`;
    }
  }
  return clean;
}

// ----------------------------------------------------------------------------
// UTR / REFERENCE EXTRACTION
// ----------------------------------------------------------------------------

export function extractReferenceUtr(particulars: string): string | undefined {
  const str = particulars.trim();

  // Pattern 1: UPI/P2A/<UTR>/ or UPI/P2M/<UTR>/
  const upiMatch = str.match(/UPI\/(?:P2A|P2M)\/(\d{10,14})\b/i);
  if (upiMatch && upiMatch[1]) return upiMatch[1];

  // Pattern 2: IMPS/P2A/<UTR>/
  const impsMatch = str.match(/IMPS\/(?:P2A|P2M)\/(\d{10,14})\b/i);
  if (impsMatch && impsMatch[1]) return impsMatch[1];

  // Pattern 3: ATM-CASH-AXIS/CPRH.../
  const atmMatch = str.match(/ATM-CASH-[^/]+\/([^/]+)\/(\d+)\//i);
  if (atmMatch && atmMatch[1]) return `${atmMatch[1]}/${atmMatch[2]}`;

  return undefined;
}

// ----------------------------------------------------------------------------
// TRANSACTION CLASSIFICATION
// ----------------------------------------------------------------------------

export function classifyTransaction(params: {
  direction: "CR" | "DR";
  description: string;
}): string {
  const desc = params.description.toUpperCase();

  if (params.direction === "DR") {
    if (desc.includes("GST @18%") || desc.includes("GST")) {
      return "EXPENSE"; // Statutory Bank Taxes
    }
    if (desc.includes("MONTHLY SERVICE CH") || desc.includes("MONTHLY AVG BAL CH") || desc.includes("CHRGS")) {
      return "EXPENSE"; // Bank Charges
    }
    if (desc.includes("ATM-CASH")) {
      return "EXPENSE"; // Cash Operations / Field Disbursal
    }
    if (desc.includes("UPI/P2M")) {
      return "EXPENSE"; // Merchant / Vendor Payment
    }
    if (desc.includes("REFUND")) {
      return "REFUND";
    }
    return "EXPENSE";
  }

  // Direction is CR (Credits)
  if (desc.includes("INTEREST") || desc.includes("INT.PD")) {
    return "BANK_INTEREST";
  }
  if (desc.includes("REFUND")) {
    return "REFUND";
  }
  if (desc.includes("ARSALAN") || desc.includes("CHISHTI")) {
    return "DONATION"; // Founding member voluntary induction / contribution
  }
  if (desc.includes("UPI") || desc.includes("IMPS")) {
    return "DONATION"; // Citizen digital voluntary contribution
  }

  return "UNKNOWN";
}

// ----------------------------------------------------------------------------
// AXIS BANK CSV PARSER
// ----------------------------------------------------------------------------

export async function parseAxisBankCsv(csvContent: string): Promise<ParsedStatementResult> {
  const lines = csvContent.split(/\r?\n/).map((l) => l.trim());

  let accountNumber = "924020035537387";
  let accountHolder = "";
  let periodStart: string | undefined;
  let periodEnd: string | undefined;
  let openingBalancePaise = 0n;
  let closingBalancePaise = 0n;

  // Header extraction
  for (const line of lines) {
    if (line.startsWith("Name :-")) {
      accountHolder = line.replace("Name :-", "").trim();
    }
    if (line.includes("Statement of Account No -") || line.includes("Statement of Axis Account No :")) {
      const accMatch = line.match(/(?:No\s*[:-]\s*)(\d{10,18})/i);
      if (accMatch) accountNumber = accMatch[1];

      const periodMatch = line.match(/From\s*:\s*(\d{2}[-/]\d{2}[-/]\d{4})\s*To\s*:\s*(\d{2}[-/]\d{2}[-/]\d{4})/i);
      if (periodMatch) {
        periodStart = normalizeDate(periodMatch[1]);
        periodEnd = normalizeDate(periodMatch[2]);
      }
    }
  }

  // Find transaction table header
  // Line format: Tran Date,Value Date,CHQNO,Transaction Particulars,Amount(INR),DR|CR,Balance(INR),Branch Name
  const transactions: ParsedTransactionRow[] = [];
  let inTransactionSection = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line) continue;

    if (line.startsWith("Tran Date,") || line.startsWith("Tran Date\t")) {
      inTransactionSection = true;
      continue;
    }

    if (inTransactionSection) {
      // End of transactions table triggers
      if (
        line.startsWith("Charge breakup") ||
        line.startsWith("Period,Recover Date") ||
        line.startsWith("TRANSACTION TOTAL") ||
        line.startsWith("1. The 'charges'") ||
        line.startsWith('"Unless the constituent') ||
        line.startsWith("CLOSING BALANCE")
      ) {
        if (line.startsWith("CLOSING BALANCE")) {
          const parts = line.split(/[,\s]+/);
          if (parts[1]) closingBalancePaise = toPaise(parts[1]);
        }
        break;
      }

      // Handle CSV line with commas
      // Note: Transaction Particulars might have internal slashes, but rarely unquoted commas.
      // Standard Axis CSV format:
      // 21-01-2025,21-01-2025,-,UPI/P2A/867619380300/ARSALAN  /CANARA BA/Payment/,20000.00,CR,20000.00,SAROJINI NAGAR OD DL
      const cols = line.split(",").map((c) => c.trim());
      if (cols.length < 7) continue;

      const dateStr = cols[0];
      if (!/^\d{2}-\d{2}-\d{4}$/.test(dateStr)) continue;

      const normDate = normalizeDate(dateStr);
      const valDate = normalizeDate(cols[1]);
      const particulars = cols[3];
      const amountStr = cols[4];
      const dir = (cols[5] || "").toUpperCase().trim() as "CR" | "DR";
      const balanceStr = cols[6];
      const branch = cols[7] || "";

      if (dir !== "CR" && dir !== "DR") continue;

      const amountPaise = toPaise(amountStr);
      const balancePaise = toPaise(balanceStr);
      const debitPaise = dir === "DR" ? amountPaise : 0n;
      const creditPaise = dir === "CR" ? amountPaise : 0n;
      const refUtr = extractReferenceUtr(particulars);
      const classification = classifyTransaction({ direction: dir, description: particulars });

      const fingerprint = await computeTransactionFingerprint({
        transaction_date: normDate,
        direction: dir,
        amount_paise: amountPaise,
        reference_utr: refUtr,
        description: particulars,
        account_number: accountNumber,
      });

      transactions.push({
        transaction_date: normDate,
        value_date: valDate,
        description: particulars,
        reference_utr: refUtr,
        amount_paise: amountPaise,
        direction: dir,
        debit_paise: debitPaise,
        credit_paise: creditPaise,
        balance_after_paise: balancePaise,
        branch_name: branch,
        classification,
        fingerprint,
        source_row: {
          raw_line: line,
          date: normDate,
          particulars,
          amount: amountStr,
          dir,
          balance: balanceStr,
          branch,
        },
      });
    }
  }

  // Derive totals from parsed rows
  let totalCreditsPaise = 0n;
  let totalDebitsPaise = 0n;
  for (const t of transactions) {
    totalCreditsPaise += t.credit_paise;
    totalDebitsPaise += t.debit_paise;
  }

  if (transactions.length > 0) {
    // If opening balance wasn't explicit, derive from first transaction balance
    const firstTx = transactions[0];
    if (firstTx.balance_after_paise !== undefined) {
      if (firstTx.direction === "CR") {
        openingBalancePaise = firstTx.balance_after_paise - firstTx.credit_paise;
      } else {
        openingBalancePaise = firstTx.balance_after_paise + firstTx.debit_paise;
      }
    }

    // Closing balance from last transaction
    const lastTx = transactions[transactions.length - 1];
    if (lastTx.balance_after_paise !== undefined) {
      closingBalancePaise = lastTx.balance_after_paise;
    }
  }

  return {
    account_number: accountNumber,
    account_holder: accountHolder,
    period_start: periodStart,
    period_end: periodEnd,
    opening_balance_paise: openingBalancePaise,
    closing_balance_paise: closingBalancePaise,
    total_credits_paise: totalCreditsPaise,
    total_debits_paise: totalDebitsPaise,
    transactions,
  };
}

// ----------------------------------------------------------------------------
// AXIS BANK TEXT / PDF PARSER
// ----------------------------------------------------------------------------

export async function parseAxisBankText(textContent: string): Promise<ParsedStatementResult> {
  const lines = textContent.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);

  let accountNumber = "924020035537387";
  let accountHolder = "";
  let periodStart: string | undefined;
  let periodEnd: string | undefined;
  let openingBalancePaise = 0n;
  let closingBalancePaise = 0n;

  for (const line of lines) {
    if (line.includes("SHEIKH ARSALAN")) {
      accountHolder = "SHEIKH ARSALAN ULLAH CHISHTI";
    }
    if (line.includes("Statement of Axis Account No :") || line.includes("Account No :")) {
      const match = line.match(/(?:Account No\s*:\s*)(\d{10,18})/i);
      if (match) accountNumber = match[1];

      const periodMatch = line.match(/From\s*:\s*(\d{2}[-/]\d{2}[-/]\d{4})\s*To\s*:\s*(\d{2}[-/]\d{2}[-/]\d{4})/i);
      if (periodMatch) {
        periodStart = normalizeDate(periodMatch[1]);
        periodEnd = normalizeDate(periodMatch[2]);
      }
    }
    if (line.startsWith("OPENING BALANCE")) {
      const m = line.match(/OPENING BALANCE\s+([.\d]+)/i);
      if (m) openingBalancePaise = toPaise(m[1]);
    }
    if (line.startsWith("CLOSING BALANCE")) {
      const m = line.match(/CLOSING BALANCE\s+([.\d]+)/i);
      if (m) closingBalancePaise = toPaise(m[1]);
    }
  }

  // Parse transaction table rows
  // Format typically:
  // DD-MM-YYYY DD-MM-YYYY Particulars Amount DR/CR Balance Branch
  const transactions: ParsedTransactionRow[] = [];
  const dateRegex = /^(\d{2}-\d{2}-\d{4})(?:\s+(\d{2}-\d{2}-\d{4}))?\s+(.+)$/;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const match = line.match(dateRegex);
    if (match) {
      const tranDate = normalizeDate(match[1]);
      const valueDate = match[2] ? normalizeDate(match[2]) : tranDate;
      const rest = match[3];

      // Match ending: <Amount> <CR|DR> <Balance> <Branch...>
      // E.g.: "20000.00 CR 20000.00 SAROJINI NAGAR OD DL"
      const endMatch = rest.match(/([.\d]+)\s+(CR|DR)\s+([.\d]+)\s*(.*)$/i);
      if (endMatch) {
        const amountStr = endMatch[1];
        const dir = endMatch[2].toUpperCase() as "CR" | "DR";
        const balanceStr = endMatch[3];
        const branch = endMatch[4] || "";
        const particulars = rest.slice(0, rest.lastIndexOf(amountStr)).trim();

        const amountPaise = toPaise(amountStr);
        const balancePaise = toPaise(balanceStr);
        const debitPaise = dir === "DR" ? amountPaise : 0n;
        const creditPaise = dir === "CR" ? amountPaise : 0n;
        const refUtr = extractReferenceUtr(particulars);
        const classification = classifyTransaction({ direction: dir, description: particulars });

        const fingerprint = await computeTransactionFingerprint({
          transaction_date: tranDate,
          direction: dir,
          amount_paise: amountPaise,
          reference_utr: refUtr,
          description: particulars,
          account_number: accountNumber,
        });

        transactions.push({
          transaction_date: tranDate,
          value_date: valueDate,
          description: particulars,
          reference_utr: refUtr,
          amount_paise: amountPaise,
          direction: dir,
          debit_paise: debitPaise,
          credit_paise: creditPaise,
          balance_after_paise: balancePaise,
          branch_name: branch,
          classification,
          fingerprint,
          source_row: {
            raw_line: line,
            tranDate,
            particulars,
            amountStr,
            dir,
            balanceStr,
            branch,
          },
        });
      }
    }
  }

  let totalCreditsPaise = 0n;
  let totalDebitsPaise = 0n;
  for (const t of transactions) {
    totalCreditsPaise += t.credit_paise;
    totalDebitsPaise += t.debit_paise;
  }

  if (transactions.length > 0) {
    const lastTx = transactions[transactions.length - 1];
    if (lastTx.balance_after_paise !== undefined) {
      closingBalancePaise = lastTx.balance_after_paise;
    }
  }

  return {
    account_number: accountNumber,
    account_holder: accountHolder,
    period_start: periodStart,
    period_end: periodEnd,
    opening_balance_paise: openingBalancePaise,
    closing_balance_paise: closingBalancePaise,
    total_credits_paise: totalCreditsPaise,
    total_debits_paise: totalDebitsPaise,
    transactions,
  };
}

// ----------------------------------------------------------------------------
// UNIVERSAL STATEMENT PARSER DISPATCHER
// ----------------------------------------------------------------------------

export async function parseStatementFile(content: string, fileType: "csv" | "pdf"): Promise<ParsedStatementResult> {
  if (fileType === "csv" || content.includes("Tran Date,")) {
    return parseAxisBankCsv(content);
  }
  return parseAxisBankText(content);
}

// ----------------------------------------------------------------------------
// RECONCILIATION ENGINE (Paise-perfect)
// ----------------------------------------------------------------------------

/**
 * Executes fundamental statement reconciliation:
 * Opening Balance + Total Credits - Total Debits = Closing Balance
 */
export function reconcileStatement(params: {
  opening_balance_paise: bigint;
  total_credits_paise: bigint;
  total_debits_paise: bigint;
  expected_closing_paise: bigint;
}): ReconciliationResult {
  const calculatedClosingPaise = params.opening_balance_paise + params.total_credits_paise - params.total_debits_paise;
  const differencePaise = calculatedClosingPaise - params.expected_closing_paise;
  const isMatched = differencePaise === 0n;

  return {
    opening_paise: params.opening_balance_paise,
    total_credits_paise: params.total_credits_paise,
    total_debits_paise: params.total_debits_paise,
    expected_closing_paise: params.expected_closing_paise,
    calculated_closing_paise: calculatedClosingPaise,
    difference_paise: differencePaise,
    is_matched: isMatched,
    status: isMatched ? "MATCHED" : "FAILED",
    difference_formatted: fromPaise(differencePaise),
  };
}

// ----------------------------------------------------------------------------
// CROSS-STATEMENT CONTINUITY CHECK
// ----------------------------------------------------------------------------

/**
 * Verifies that the previous period closing balance strictly equals
 * the current period opening balance.
 */
export function verifyStatementContinuity(params: {
  previous_closing_paise?: bigint | null;
  current_opening_paise: bigint;
  previous_period_id?: string;
  previous_period_end_date?: string;
  current_period_start_date?: string;
}): ContinuityResult & { reason?: string } {
  if (params.previous_closing_paise === undefined || params.previous_closing_paise === null) {
    return {
      previous_closing_paise: 0n,
      current_opening_paise: params.current_opening_paise,
      difference_paise: 0n,
      is_continuous: true,
      status: "NOT_APPLICABLE",
      reason: "Initial period",
    };
  }

  // Check calendar gap if dates provided
  if (params.previous_period_end_date && params.current_period_start_date) {
    const prevEnd = new Date(params.previous_period_end_date);
    const currStart = new Date(params.current_period_start_date);
    const dayDiff = (currStart.getTime() - prevEnd.getTime()) / (1000 * 3600 * 24);
    if (dayDiff > 2) {
      return {
        previous_period_id: params.previous_period_id,
        previous_closing_paise: params.previous_closing_paise,
        current_opening_paise: params.current_opening_paise,
        difference_paise: params.current_opening_paise - params.previous_closing_paise,
        is_continuous: false,
        status: "MISMATCH",
        reason: `Calendar gap detected: ${Math.round(dayDiff)} days between periods`,
      };
    }
  }

  const diff = params.current_opening_paise - params.previous_closing_paise;
  const isContinuous = diff === 0n;

  return {
    previous_period_id: params.previous_period_id,
    previous_closing_paise: params.previous_closing_paise,
    current_opening_paise: params.current_opening_paise,
    difference_paise: diff,
    is_continuous: isContinuous,
    status: isContinuous ? "CONTINUOUS" : "MISMATCH",
    reason: isContinuous ? "Balances match" : `Discrepancy of Rs. ${fromPaise(diff)}`,
  };
}

// ----------------------------------------------------------------------------
// FILTER TRANSACTIONS FOR 6-MONTH REPORTING PERIOD
// ----------------------------------------------------------------------------

export function filterTransactionsByDateRange(
  transactions: ParsedTransactionRow[],
  startDate: string, // YYYY-MM-DD
  endDate: string   // YYYY-MM-DD
): ParsedTransactionRow[] {
  return transactions.filter((t) => {
    return t.transaction_date >= startDate && t.transaction_date <= endDate;
  });
}

// ----------------------------------------------------------------------------
// DUPLICATE TRANSACTION DETECTION
// ----------------------------------------------------------------------------

export async function findDuplicateTransactions(
  transactions: ParsedTransactionRow[],
  accountLast4 = ""
): Promise<ParsedTransactionRow[]> {
  const fpMap = new Map<string, ParsedTransactionRow[]>();

  for (const t of transactions) {
    const isCredit = t.credit_paise > 0n;
    const fp = await computeTransactionFingerprint({
      transaction_date: t.transaction_date,
      direction: isCredit ? "CR" : "DR",
      amount_paise: isCredit ? t.credit_paise : t.debit_paise,
      reference_utr: t.reference_utr || "",
      description: t.description,
      account_number: accountLast4,
    });

    const list = fpMap.get(fp) || [];
    list.push(t);
    fpMap.set(fp, list);
  }

  const duplicates: ParsedTransactionRow[] = [];
  for (const list of fpMap.values()) {
    if (list.length > 1) {
      duplicates.push(...list);
    }
  }
  return duplicates;
}

// ----------------------------------------------------------------------------
// PRIVACY FILTER & REFERENCE MASKING
// ----------------------------------------------------------------------------

export function sanitizePublicTransactions<T extends {
  description: string;
  reference_utr?: string | null;
}>(transactions: T[]): (T & { reference_masked: string | null })[] {
  return transactions.map((t) => {
    let safeDesc = t.description;
    // Mask full account numbers or mobile numbers
    safeDesc = safeDesc.replace(/\b\d{10,18}\b/g, (m) => `XXXX${m.slice(-4)}`);

    let maskedRef: string | null = null;
    if (t.reference_utr) {
      maskedRef = t.reference_utr.length > 4
        ? `***${t.reference_utr.slice(-4)}`
        : t.reference_utr;
    }

    return {
      ...t,
      description: safeDesc,
      reference_masked: maskedRef,
    };
  });
}

// ----------------------------------------------------------------------------
// PRE-PUBLICATION STATUTORY CHECK
// ----------------------------------------------------------------------------

export function validatePeriodPublication(params: {
  reconciliation_difference_paise: bigint;
  unclassified_count: number;
  has_statement: boolean;
}): { allowed: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!params.has_statement) {
    errors.push("No bank statement document is uploaded for this period.");
  }
  if (params.reconciliation_difference_paise !== 0n) {
    errors.push(`Reconciliation has a difference of Rs. ${fromPaise(params.reconciliation_difference_paise)}. Must be exactly Rs. 0.00.`);
  }
  if (params.unclassified_count > 0) {
    errors.push(`There are ${params.unclassified_count} unclassified transactions. All must be classified before publication.`);
  }

  return {
    allowed: errors.length === 0,
    errors,
  };
}
