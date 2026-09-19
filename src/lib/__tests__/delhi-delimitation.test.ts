import {
  ASSEMBLY_CONSTITUENCIES,
  MCD_WARDS,
  lokSabhaToVidhanSabha,
  delhiConstituenciesAndWards,
  allWardsList,
  getConstituencyByNumber,
  getConstituencyByName,
  getWardsForConstituency,
  getWardByNumber,
  searchWards,
} from "../delhi_data";

console.log("\n=======================================================");
console.log("NCT OF DELHI POST-2022 DELIMITATION DATA INTEGRITY SUITE");
console.log("=======================================================\n");

let passed = 0;
let failed = 0;

function assert(condition: boolean, testName: string) {
  if (condition) {
    console.log(`  [PASS] ${testName}`);
    passed++;
  } else {
    console.error(`  [FAIL] ${testName}`);
    failed++;
  }
}

// 1. AC count and sequence
assert(ASSEMBLY_CONSTITUENCIES.length === 70, "Total Assembly Constituencies count is exactly 70");
const acNumbers = ASSEMBLY_CONSTITUENCIES.map((a) => a.ac_number);
const acNumbersContiguous = acNumbers.every((num, idx) => num === idx + 1);
assert(acNumbersContiguous, "Assembly Constituencies are contiguous from AC 1 to AC 70");

// 2. MCD Wards count and sequence
assert(MCD_WARDS.length === 250, "Total MCD Wards count is exactly 250");
const wardNumbers = MCD_WARDS.map((w) => w.ward_number);
const wardNumbersContiguous = wardNumbers.every((num, idx) => num === idx + 1);
assert(wardNumbersContiguous, "MCD Wards are contiguous from Ward 1 to Ward 250");

// 3. Every ward maps to a valid AC
const allWardsValidAc = MCD_WARDS.every(
  (w) => w.ac_number >= 1 && w.ac_number <= 70 && w.ac_name.trim().length > 0
);
assert(allWardsValidAc, "Every single MCD ward links to a valid Assembly Constituency (1-70)");

// 4. Municipal AC coverage (68 municipal ACs + 2 special administrative zones)
const distinctAcsInWards = new Set(MCD_WARDS.map((w) => w.ac_number));
assert(distinctAcsInWards.size === 68, "Wards span across exactly 68 municipal Assembly Constituencies");
assert(!distinctAcsInWards.has(38), "Delhi Cantonment (AC 38) correctly has 0 MCD wards (Cantonment Board area)");
assert(!distinctAcsInWards.has(40), "New Delhi (AC 40) correctly has 0 MCD wards (NDMC civic area)");

// 5. Statutory reservation distribution
const genCount = MCD_WARDS.filter((w) => w.reservation === "GEN").length;
const womenCount = MCD_WARDS.filter((w) => w.reservation === "WOMEN").length;
const scCount = MCD_WARDS.filter((w) => w.reservation === "SC").length;
const scWomenCount = MCD_WARDS.filter((w) => w.reservation === "SC_WOMEN").length;

assert(genCount === 104, `GEN wards count is 104 (actual: ${genCount})`);
assert(womenCount === 100, `WOMEN (General) wards count is 100 (actual: ${womenCount})`);
assert(scCount === 25, `SC (General) wards count is 25 (actual: ${scCount})`);
assert(scWomenCount === 21, `SC_WOMEN wards count is 21 (actual: ${scWomenCount})`);
assert(scCount + scWomenCount === 46, "Total SC-reserved seats equals 46 statutory seats");

// 6. SC Assembly Constituencies
const scAcs = ASSEMBLY_CONSTITUENCIES.filter((a) => a.is_reserved_sc);
assert(scAcs.length === 12, `Exactly 12 Assembly Constituencies are marked as SC reserved (actual: ${scAcs.length})`);

// 7. Helper functions
const okhla = getConstituencyByNumber(54);
assert(okhla?.name === "Okhla" && okhla.lok_sabha === "East Delhi", "getConstituencyByNumber(54) returns Okhla");

const okhlaByName = getConstituencyByName("okhla");
assert(okhlaByName?.ac_number === 54, "getConstituencyByName('okhla') case-insensitively returns AC 54");

const okhlaWards = getWardsForConstituency("Okhla");
assert(okhlaWards.length === 6, "getWardsForConstituency('Okhla') returns 6 municipal wards");
const hasZakirNagar = okhlaWards.some((w) => w.name === "Zakir Nagar" && w.ward_number === 189);
assert(hasZakirNagar, "Okhla correctly contains Ward 189 Zakir Nagar");

const ward189 = getWardByNumber(189);
assert(ward189?.name === "Zakir Nagar" && ward189.reservation === "WOMEN", "getWardByNumber(189) returns Zakir Nagar [WOMEN]");

const searchResults = searchWards("Chandni Chowk");
assert(searchResults.length > 0, "searchWards('Chandni Chowk') returns matching wards");

// 8. Backwards compatibility exports
assert(Object.keys(lokSabhaToVidhanSabha).length === 7, "lokSabhaToVidhanSabha contains 7 Parliamentary Constituencies");
const totalMappedAcs = Object.values(lokSabhaToVidhanSabha).flat().length;
assert(totalMappedAcs === 70, "lokSabhaToVidhanSabha maps all 70 Assembly Constituencies");

assert(Object.keys(delhiConstituenciesAndWards).length === 70, "delhiConstituenciesAndWards has all 70 AC keys");
assert(allWardsList.length === 250, "allWardsList contains all 250 wards");

console.log("\n-------------------------------------------------------");
console.log(`TOTAL TESTS:  ${passed + failed}`);
console.log(`PASSED:       ${passed}`);
console.log(`FAILED:       ${failed}`);
console.log("-------------------------------------------------------\n");

if (failed > 0) {
  process.exit(1);
}
