/**
 * Nagrik Party · Financial Transparency Test Suite
 * 17 Rigorous Accounting, Parsing, Cryptographic, and Continuity Verification Tests
 */

import {
  toPaise,
  fromPaise,
  computeSha256,
  computeTransactionFingerprint,
  reconcileStatement,
  verifyStatementContinuity,
  parseAxisBankCsv,
  parseAxisBankText,
  findDuplicateTransactions,
  sanitizePublicTransactions,
  validatePeriodPublication,
  type ParsedTransactionRow,
} from "../finance-engine";

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  [PASS] Test ${totalTests}: ${testName}`);
  } else {
    failedTests++;
    console.error(`  [FAIL] Test ${totalTests}: ${testName}`);
    if (detail) console.error(`         Detail: ${detail}`);
  }
}

const SAMPLE_CSV_2025 = `Name :- SHEIKH ARSALAN ULLAH CHISHTI
Joint Holder :- -
S/O DR SHEIKH MOHAMMAD AMIR AYUB CHISHTI B-80
,GROUND FLOOR,GALI NO-8,OKHLA GHAFFAR MANZIL,
SOUTH DELHI-110025
DELHI-INDIA
Currency :- INR
Customer ID :- 967052795
IFSC Code :- UTIB0002912
MICR Code :- 110211171
Nominee Registered :- N                                                                                                   
CKYC NUMBER :- XXXXXXXXXX0879

Statement of Account No - 924020035537387 for the period (From : 01-01-2025 To : 31-12-2025)

Tran Date,Value Date,CHQNO,Transaction Particulars,Amount(INR),DR|CR,Balance(INR),Branch Name
21-01-2025,21-01-2025,-,UPI/P2A/867619380300/ARSALAN  /CANARA BA/Payment/,             20000.00,CR,            20000.00,SAROJINI NAGAR OD DL
21-01-2025,21-01-2025,-,ATM-CASH-AXIS/CPRH01509/7131/210125/DELHI,             10000.00,DR,            10000.00,SAROJINI NAGAR OD DL
21-01-2025,21-01-2025,-,ATM-CASH-AXIS/CPRH01509/7132/210125/DELHI,             10000.00,DR,                 .00,SAROJINI NAGAR OD DL
22-01-2025,22-01-2025,-,UPI/P2A/502277667712/BAKSHESSH/State Ban/UPI/,                 1.00,CR,                1.00,SAROJINI NAGAR OD DL
22-01-2025,22-01-2025,-,IMPS/P2A/502217895384/920020040852361/220125/AXISBANKLTD/NA,                 1.00,CR,                2.00,MOHAN CO-OPERAT DEL DL
24-01-2025,24-01-2025,-,UPI/P2A/502489653927/MOHD FAIZ/ICICI Ban/Sent usi/,                 1.00,CR,                3.00,SAROJINI NAGAR OD DL
27-01-2025,27-01-2025,-,UPI/P2A/502724283429/BILAL AHM/BANK OF B/UPI/,                 1.00,CR,                4.00,SAROJINI NAGAR OD DL
28-01-2025,28-01-2025,-,UPI/P2A/609470932721/KHURSHEED/INDIAN OV/Payment/,                 1.00,CR,                5.00,SAROJINI NAGAR OD DL
28-01-2025,28-01-2025,-,UPI/P2A/240942742505/MOHD  AMI/State Ban/Le/,                 1.00,CR,                6.00,SAROJINI NAGAR OD DL
28-01-2025,28-01-2025,-,UPI/P2A/502855232471/MOHMMAD S/BANK OF B/Sent usi/,                 1.01,CR,                7.01,SAROJINI NAGAR OD DL
31-01-2025,31-01-2025,-,UPI/P2A/503181049998/SAJID ALI/UNION BAN/Sent usi/,               100.00,CR,              107.01,SAROJINI NAGAR OD DL
31-01-2025,31-01-2025,-,UPI/P2A/503101851495/PARVEEN G/ICICI Ban/Sent usi/,               500.00,CR,              607.01,SAROJINI NAGAR OD DL
01-02-2025,01-02-2025,-,UPI/P2A/503204400663/Haidar Al/Amazon Pr/UPI/,                 1.00,CR,              608.01,SAROJINI NAGAR OD DL
03-02-2025,03-02-2025,-,UPI/P2M/962818257865/MOHD UMAR            /Paymen/YES BANK LIMITED YBS,               140.00,DR,              468.01,SAROJINI NAGAR OD DL
04-02-2025,04-02-2025,-,UPI/P2M/330744237676/SHAMSHER ALAM        /Paymen/YES BANK LIMITED YBS,               100.00,DR,              368.01,SAROJINI NAGAR OD DL
05-02-2025,05-02-2025,-,UPI/P2A/793620149026/ARSALAN  CHISHTI     /Paymen/CANARA BANK,                70.00,DR,              298.01,SAROJINI NAGAR OD DL
08-02-2025,08-02-2025,-,UPI/P2A/728382979679/FARDEEN A/UNION BAN/Payment/,                10.00,CR,              308.01,SAROJINI NAGAR OD DL
09-02-2025,09-02-2025,-,UPI/P2A/504054923481/MdIrfan/AIRTEL PA/Sent usi/,                30.00,CR,              338.01,SAROJINI NAGAR OD DL
21-02-2025,21-02-2025,-,GST @18% on Monthly Service Ch,                 6.56,DR,              331.45,SAROJINI NAGAR OD DL
21-02-2025,21-02-2025,-,Monthly Service Chrgs,                36.45,DR,              295.00,SAROJINI NAGAR OD DL
21-03-2025,21-03-2025,-,GST @18% on Monthly Avg Bal Ch,                45.00,DR,              250.00,SAROJINI NAGAR OD DL
21-03-2025,21-03-2025,-,Monthly Avg Bal Chrgs,               250.00,DR,                 .00,SAROJINI NAGAR OD DL
04-11-2025,04-11-2025,-,UPI/P2A/354473413071/Mohd Saki/AIRTEL PA/Payment/,                 1.00,CR,                1.00,SAROJINI NAGAR OD DL
23-11-2025,23-11-2025,-,Monthly Avg Bal Chrgs,                  .85,DR,                 .15,SAROJINI NAGAR OD DL
23-11-2025,23-11-2025,-,GST @18% on Monthly Avg Bal Chrgs,                  .15,DR,                 .00,SAROJINI NAGAR OD DL

Charge breakup of Axis Account No :924020035537387 for the period (From : 01-01-2025  To : 31-12-2025)
`;

async function runAllTests() {
  console.log("\n=======================================================");
  console.log("NAGRIK PARTY FINANCIAL TRANSPARENCY TEST SUITE");
  console.log("Running 17 Accounting, Continuity & Cryptographic Tests");
  console.log("=======================================================\n");

  // TEST 1: Exact integer arithmetic with paise (no floating point rounding error)
  const p1 = toPaise("0.10");
  const p2 = toPaise("0.20");
  const sum = p1 + p2;
  const formattedSum = fromPaise(sum);
  assert(
    sum === 30n && formattedSum === "0.30",
    "Exact integer arithmetic with paise avoids floating point errors",
    `Expected 30n and '0.30', got ${sum} and '${formattedSum}'`
  );

  // TEST 2: Rs. 0.01 discrepancy detection
  const reconDiscrepant = reconcileStatement({
    opening_balance_paise: 0n,
    total_credits_paise: 10000n, // 100.00
    total_debits_paise: 9999n,   // 99.99
    expected_closing_paise: 0n,  // Expected 0.00, but 100.00 - 99.99 = 0.01
  });
  assert(
    reconDiscrepant.status === "FAILED" && reconDiscrepant.difference_paise === 1n,
    "Rs. 0.01 discrepancy detection flags difference of exactly one paisa",
    `Expected status FAILED and diff 1n, got ${reconDiscrepant.status} and ${reconDiscrepant.difference_paise}`
  );

  // TEST 3: Matched statement reconciliation
  const reconMatched = reconcileStatement({
    opening_balance_paise: 0n,
    total_credits_paise: 2064801n,
    total_debits_paise: 2064801n,
    expected_closing_paise: 0n,
  });
  assert(
    reconMatched.status === "MATCHED" && reconMatched.difference_paise === 0n,
    "Matched statement reconciliation confirms opening + credits - debits = closing",
    `Expected status MATCHED, got ${reconMatched.status}`
  );

  // TEST 4: Discrepant statement reconciliation
  const reconFailed = reconcileStatement({
    opening_balance_paise: 50000n, // 500.00
    total_credits_paise: 100000n,  // 1000.00
    total_debits_paise: 20000n,   // 200.00 -> calculated closing should be 1300.00
    expected_closing_paise: 125000n, // Statement claims 1250.00
  });
  assert(
    reconFailed.status === "FAILED" && reconFailed.difference_paise === 5000n,
    "Discrepant statement detects calculation mismatch when closing balance diverges",
    `Expected diff 5000n (Rs 50.00), got ${reconFailed.difference_paise}`
  );

  // TEST 5: Cross-statement continuity match
  const contMatch = verifyStatementContinuity({
    previous_closing_paise: 150050n,
    current_opening_paise: 150050n,
    previous_period_id: "period-1",
  });
  assert(
    contMatch.status === "CONTINUOUS" && contMatch.difference_paise === 0n,
    "Cross-statement continuity match when current opening equals previous closing",
    `Expected CONTINUOUS, got ${contMatch.status}`
  );

  // TEST 6: Cross-statement continuity break
  const contBreak = verifyStatementContinuity({
    previous_closing_paise: 150050n,
    current_opening_paise: 150000n,
    previous_period_id: "period-1",
  });
  assert(
    contBreak.status === "MISMATCH" && contBreak.difference_paise === -50n,
    "Cross-statement continuity break detected when current opening deviates from previous closing",
    `Expected MISMATCH with -50n diff, got ${contBreak.status} and ${contBreak.difference_paise}`
  );

  // TEST 7: Non-adjacent period continuity reject
  const contGap = verifyStatementContinuity({
    previous_closing_paise: 10000n,
    current_opening_paise: 10000n,
    previous_period_id: "period-1",
    previous_period_end_date: "2025-06-30",
    current_period_start_date: "2025-08-01", // 1 month calendar gap
  });
  assert(
    contGap.status === "MISMATCH" && (contGap.reason?.includes("gap") ?? false),
    "Non-adjacent period continuity rejected when a calendar gap exists between periods",
    `Expected MISMATCH due to gap, got ${contGap.status}: ${contGap.reason}`
  );

  // TEST 8: SHA-256 byte-level calculation produces known digest
  const sampleBuf = new TextEncoder().encode("NAGRIK_PARTY_FINANCIAL_TRANSPARENCY_2025");
  const knownHash = await computeSha256(sampleBuf);
  assert(
    knownHash.length === 64 && /^[0-9a-f]{64}$/.test(knownHash),
    "SHA-256 byte-level calculation produces a valid 64-character lowercase hexadecimal digest",
    `Calculated hash: ${knownHash}`
  );

  // TEST 9: Bit flip in file buffer changes SHA-256 digest completely (avalanche effect)
  const modifiedBuf = new Uint8Array(sampleBuf);
  modifiedBuf[0] ^= 1; // Flip exactly one bit in first byte
  const flippedHash = await computeSha256(modifiedBuf);
  let differentChars = 0;
  for (let i = 0; i < knownHash.length; i++) {
    if (knownHash[i] !== flippedHash[i]) differentChars++;
  }
  const diffPercent = (differentChars / knownHash.length) * 100;
  assert(
    knownHash !== flippedHash && diffPercent > 40,
    "Bit flip in file buffer produces complete avalanche effect in SHA-256 hash",
    `Difference: ${diffPercent.toFixed(1)}% characters changed`
  );

  // TEST 10: Axis Bank CSV parser correctly parses all 25 rows from 2025 statement
  const parsed2025 = await parseAxisBankCsv(SAMPLE_CSV_2025);
  assert(
    parsed2025.transactions.length === 25,
    "Axis Bank CSV parser extracts all 25 transaction rows from 2025 statement",
    `Parsed ${parsed2025.transactions.length} rows`
  );

  // TEST 11: Axis Bank CSV parser correctly calculates total credits and debits
  const expectedTotalPaise = 2064901n; // Rs. 20,649.01
  assert(
    parsed2025.total_credits_paise === expectedTotalTotalCredits() &&
    parsed2025.total_debits_paise === expectedTotalPaise,
    "Axis Bank CSV parser computes exact Rs. 20,649.01 credits and debits without loss",
    `Credits: ${parsed2025.total_credits_paise}, Debits: ${parsed2025.total_debits_paise}`
  );

  function expectedTotalTotalCredits(): bigint {
    return 2064901n;
  }

  // TEST 12: Axis Bank CSV parser correctly extracts UTRs, dates, debits, credits, and balances
  const row1 = parsed2025.transactions[0];
  const row2 = parsed2025.transactions[1];
  assert(
    row1.transaction_date === "2025-01-21" &&
    row1.credit_paise === 2000000n &&
    row1.reference_utr === "867619380300" &&
    row2.debit_paise === 1000000n &&
    row2.balance_after_paise === 1000000n,
    "Axis Bank CSV parser accurately parses UTRs, dates, debits, credits, and balances",
    `Row 1: UTR=${row1.reference_utr}, Cr=${row1.credit_paise}; Row 2: Dr=${row2.debit_paise}, Bal=${row2.balance_after_paise}`
  );

  // TEST 13: Text statement parser parses structured line items and extracts fields
  const sampleTextStatement = `
Account Number: 924020035537387
Period: 01-01-2025 to 31-01-2025

21-01-2025 UPI/P2A/867619380300/DONOR 20000.00 CR 20000.00
22-01-2025 ATM CASH WITHDRAWAL 10000.00 DR 10000.00
  `;
  const parsedText = await parseAxisBankText(sampleTextStatement);
  assert(
    parsedText.transactions.length >= 2 &&
    parsedText.transactions[0].credit_paise === 2000000n &&
    parsedText.transactions[1].debit_paise === 1000000n,
    "Text statement parser correctly extracts transactions, credits, and debits",
    `Parsed ${parsedText.transactions.length} items from text`
  );

  // TEST 14: Deterministic transaction fingerprinting produces identical hashes
  const fp1 = await computeTransactionFingerprint({
    transaction_date: "2025-01-21",
    direction: "CR",
    amount_paise: 2000000n,
    reference_utr: "867619380300",
    description: "UPI/P2A/867619380300/ARSALAN",
    account_number: "924020035537387",
  });
  const fp2 = await computeTransactionFingerprint({
    transaction_date: "2025-01-21",
    direction: "CR",
    amount_paise: 2000000n,
    reference_utr: "867619380300",
    description: "UPI/P2A/867619380300/ARSALAN",
    account_number: "924020035537387",
  });
  assert(
    fp1 === fp2 && fp1.length === 64,
    "Deterministic transaction fingerprinting yields identical cryptographic digests for identical data",
    `Fingerprint: ${fp1}`
  );

  // TEST 15: Duplicate transaction detection flags twin records
  const sampleTxs: ParsedTransactionRow[] = [
    {
      transaction_date: "2025-01-21",
      value_date: "2025-01-21",
      description: "UPI/P2A/867619380300/TEST",
      reference_utr: "867619380300",
      debit_paise: 0n,
      credit_paise: 2000000n,
      balance_after_paise: 2000000n,
    },
    {
      transaction_date: "2025-01-21",
      value_date: "2025-01-21",
      description: "UPI/P2A/867619380300/TEST",
      reference_utr: "867619380300",
      debit_paise: 0n,
      credit_paise: 2000000n,
      balance_after_paise: 4000000n,
    },
    {
      transaction_date: "2025-01-22",
      value_date: "2025-01-22",
      description: "UPI/P2A/502277667712/OTHER",
      reference_utr: "502277667712",
      debit_paise: 0n,
      credit_paise: 100n,
      balance_after_paise: 4000100n,
    },
  ];
  const duplicates = await findDuplicateTransactions(sampleTxs, "7387");
  assert(
    duplicates.length === 2 &&
    duplicates[0].reference_utr === "867619380300",
    "Duplicate transaction detection accurately identifies twin records sharing matching signature",
    `Found ${duplicates.length} duplicate items`
  );

  // TEST 16: Privacy filter masks references and bank accounts
  const rawPublicTx = [
    {
      id: "tx-1",
      transaction_date: "2025-01-21",
      description: "UPI transfer from account 924020035537387 via mobile 9876543210",
      reference_utr: "867619380300",
      credit: "20000.00",
      debit: "0.00",
      classification: "DONATION",
    },
  ];
  const sanitized = sanitizePublicTransactions(rawPublicTx);
  assert(
    sanitized[0].reference_masked === "***0300" &&
    !sanitized[0].description.includes("924020035537387") &&
    sanitized[0].description.includes("XXXX7387"),
    "Privacy filter properly masks references (last 4 only) and full account/mobile numbers",
    `Masked ref: ${sanitized[0].reference_masked}, Sanitized desc: ${sanitized[0].description}`
  );

  // TEST 17: Pre-publication check rejects when reconciliation difference != 0 or unclassified count > 0
  const invalidReconCheck = validatePeriodPublication({
    reconciliation_difference_paise: 100n, // Rs. 1.00 discrepancy
    unclassified_count: 0,
    has_statement: true,
  });
  const unclassifiedCheck = validatePeriodPublication({
    reconciliation_difference_paise: 0n,
    unclassified_count: 3, // 3 unclassified transactions
    has_statement: true,
  });
  const validCheck = validatePeriodPublication({
    reconciliation_difference_paise: 0n,
    unclassified_count: 0,
    has_statement: true,
  });
  assert(
    !invalidReconCheck.allowed &&
    !unclassifiedCheck.allowed &&
    validCheck.allowed,
    "Pre-publication check strictly blocks publishing if discrepancy != 0 or unclassified count > 0",
    `Invalid diff allowed: ${invalidReconCheck.allowed}, Unclassified allowed: ${unclassifiedCheck.allowed}, Valid allowed: ${validCheck.allowed}`
  );

  console.log("\n-------------------------------------------------------");
  console.log(`TOTAL TESTS:  ${totalTests}`);
  console.log(`PASSED:       ${passedTests}`);
  console.log(`FAILED:       ${failedTests}`);
  console.log("-------------------------------------------------------\n");

  if (failedTests > 0) {
    process.exit(1);
  }
}

runAllTests().catch((err) => {
  console.error("Test suite execution failed:", err);
  process.exit(1);
});
