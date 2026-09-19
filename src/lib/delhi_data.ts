/**
 * NCT of Delhi Administrative & Electoral Data
 * Post-2022 Delimitation Order (Ministry of Home Affairs / State Election Commission)
 *
 * Covers:
 * - 7 Parliamentary Constituencies (Lok Sabha)
 * - 70 Assembly Constituencies (Vidhan Sabha AC 01 - AC 70)
 * - 250 Municipal Wards (MCD Wards 001 - 250) + Special Administrative Zones
 */

export type WardReservation = 'GEN' | 'WOMEN' | 'SC' | 'SC_WOMEN';

export interface AssemblyConstituency {
  ac_number: number;
  name: string;
  lok_sabha: string;
  district: string;
  ward_count: number;
  zone: string;
  is_reserved_sc: boolean;
}

export interface MCDWard {
  ward_number: number;
  name: string;
  raw_name: string;
  ac_number: number;
  ac_name: string;
  lok_sabha: string;
  district: string;
  zone: string;
  reservation: WardReservation;
}

export const ASSEMBLY_CONSTITUENCIES: AssemblyConstituency[] = [
  {
    "ac_number": 1,
    "name": "Narela",
    "lok_sabha": "North West Delhi",
    "district": "North",
    "ward_count": 5,
    "zone": "Narela",
    "is_reserved_sc": false
  },
  {
    "ac_number": 2,
    "name": "Burari",
    "lok_sabha": "North East Delhi",
    "district": "Central",
    "ward_count": 5,
    "zone": "Civil Lines",
    "is_reserved_sc": false
  },
  {
    "ac_number": 3,
    "name": "Timarpur",
    "lok_sabha": "North East Delhi",
    "district": "Central",
    "ward_count": 3,
    "zone": "Civil Lines",
    "is_reserved_sc": false
  },
  {
    "ac_number": 4,
    "name": "Adarsh Nagar",
    "lok_sabha": "Chandni Chowk",
    "district": "North",
    "ward_count": 3,
    "zone": "Civil Lines",
    "is_reserved_sc": false
  },
  {
    "ac_number": 5,
    "name": "Badli",
    "lok_sabha": "North West Delhi",
    "district": "North",
    "ward_count": 4,
    "zone": "Civil Lines",
    "is_reserved_sc": false
  },
  {
    "ac_number": 6,
    "name": "Rithala",
    "lok_sabha": "North West Delhi",
    "district": "North West",
    "ward_count": 5,
    "zone": "Rohini",
    "is_reserved_sc": false
  },
  {
    "ac_number": 7,
    "name": "Bawana",
    "lok_sabha": "North West Delhi",
    "district": "North",
    "ward_count": 6,
    "zone": "Narela",
    "is_reserved_sc": true
  },
  {
    "ac_number": 8,
    "name": "Mundka",
    "lok_sabha": "North West Delhi",
    "district": "West",
    "ward_count": 5,
    "zone": "Narela",
    "is_reserved_sc": false
  },
  {
    "ac_number": 9,
    "name": "Kirari",
    "lok_sabha": "North West Delhi",
    "district": "North West",
    "ward_count": 5,
    "zone": "Rohini",
    "is_reserved_sc": false
  },
  {
    "ac_number": 10,
    "name": "Sultan Pur Majra",
    "lok_sabha": "North West Delhi",
    "district": "North West",
    "ward_count": 3,
    "zone": "Rohini",
    "is_reserved_sc": true
  },
  {
    "ac_number": 11,
    "name": "Nangloi Jat",
    "lok_sabha": "North West Delhi",
    "district": "West",
    "ward_count": 4,
    "zone": "West",
    "is_reserved_sc": false
  },
  {
    "ac_number": 12,
    "name": "Mangol Puri",
    "lok_sabha": "North West Delhi",
    "district": "North West",
    "ward_count": 3,
    "zone": "Rohini",
    "is_reserved_sc": true
  },
  {
    "ac_number": 13,
    "name": "Rohini",
    "lok_sabha": "North West Delhi",
    "district": "North West",
    "ward_count": 3,
    "zone": "Rohini",
    "is_reserved_sc": false
  },
  {
    "ac_number": 14,
    "name": "Shalimar Bagh",
    "lok_sabha": "Chandni Chowk",
    "district": "North West",
    "ward_count": 3,
    "zone": "Keshav Puram",
    "is_reserved_sc": false
  },
  {
    "ac_number": 15,
    "name": "Shakur Basti",
    "lok_sabha": "Chandni Chowk",
    "district": "North",
    "ward_count": 4,
    "zone": "Keshav Puram",
    "is_reserved_sc": false
  },
  {
    "ac_number": 16,
    "name": "Tri Nagar",
    "lok_sabha": "Chandni Chowk",
    "district": "North",
    "ward_count": 3,
    "zone": "Keshav Puram",
    "is_reserved_sc": false
  },
  {
    "ac_number": 17,
    "name": "Wazirpur",
    "lok_sabha": "Chandni Chowk",
    "district": "North",
    "ward_count": 2,
    "zone": "Keshav Puram",
    "is_reserved_sc": false
  },
  {
    "ac_number": 18,
    "name": "Model Town",
    "lok_sabha": "Chandni Chowk",
    "district": "North",
    "ward_count": 3,
    "zone": "Civil Lines",
    "is_reserved_sc": false
  },
  {
    "ac_number": 19,
    "name": "Sadar Bazar",
    "lok_sabha": "Chandni Chowk",
    "district": "Central",
    "ward_count": 4,
    "zone": "City SP",
    "is_reserved_sc": false
  },
  {
    "ac_number": 20,
    "name": "Chandni Chowk",
    "lok_sabha": "Chandni Chowk",
    "district": "Central",
    "ward_count": 3,
    "zone": "City SP",
    "is_reserved_sc": false
  },
  {
    "ac_number": 21,
    "name": "Matia Mahal",
    "lok_sabha": "Chandni Chowk",
    "district": "Central",
    "ward_count": 2,
    "zone": "City SP",
    "is_reserved_sc": false
  },
  {
    "ac_number": 22,
    "name": "Ballimaran",
    "lok_sabha": "Chandni Chowk",
    "district": "Central",
    "ward_count": 3,
    "zone": "City SP",
    "is_reserved_sc": false
  },
  {
    "ac_number": 23,
    "name": "Karol Bagh",
    "lok_sabha": "New Delhi",
    "district": "Central",
    "ward_count": 3,
    "zone": "Karol Bagh",
    "is_reserved_sc": true
  },
  {
    "ac_number": 24,
    "name": "Patel Nagar",
    "lok_sabha": "New Delhi",
    "district": "Central",
    "ward_count": 4,
    "zone": "Karol Bagh",
    "is_reserved_sc": true
  },
  {
    "ac_number": 25,
    "name": "Moti Nagar",
    "lok_sabha": "New Delhi",
    "district": "West",
    "ward_count": 4,
    "zone": "Karol Bagh",
    "is_reserved_sc": false
  },
  {
    "ac_number": 26,
    "name": "Madipur",
    "lok_sabha": "West Delhi",
    "district": "West",
    "ward_count": 3,
    "zone": "West",
    "is_reserved_sc": true
  },
  {
    "ac_number": 27,
    "name": "Rajouri Garden",
    "lok_sabha": "West Delhi",
    "district": "West",
    "ward_count": 3,
    "zone": "West",
    "is_reserved_sc": false
  },
  {
    "ac_number": 28,
    "name": "Hari Nagar",
    "lok_sabha": "West Delhi",
    "district": "West",
    "ward_count": 4,
    "zone": "West",
    "is_reserved_sc": false
  },
  {
    "ac_number": 29,
    "name": "Tilak Nagar",
    "lok_sabha": "West Delhi",
    "district": "West",
    "ward_count": 3,
    "zone": "West",
    "is_reserved_sc": false
  },
  {
    "ac_number": 30,
    "name": "Janakpuri",
    "lok_sabha": "West Delhi",
    "district": "West",
    "ward_count": 3,
    "zone": "West",
    "is_reserved_sc": false
  },
  {
    "ac_number": 31,
    "name": "Vikas Puri",
    "lok_sabha": "West Delhi",
    "district": "West",
    "ward_count": 6,
    "zone": "West",
    "is_reserved_sc": false
  },
  {
    "ac_number": 32,
    "name": "Uttam Nagar",
    "lok_sabha": "West Delhi",
    "district": "South West",
    "ward_count": 3,
    "zone": "Najafgarh",
    "is_reserved_sc": false
  },
  {
    "ac_number": 33,
    "name": "Dwarka",
    "lok_sabha": "West Delhi",
    "district": "South West",
    "ward_count": 3,
    "zone": "Najafgarh",
    "is_reserved_sc": false
  },
  {
    "ac_number": 34,
    "name": "Matiala",
    "lok_sabha": "West Delhi",
    "district": "South West",
    "ward_count": 4,
    "zone": "Najafgarh",
    "is_reserved_sc": false
  },
  {
    "ac_number": 35,
    "name": "Najafgarh",
    "lok_sabha": "West Delhi",
    "district": "South West",
    "ward_count": 5,
    "zone": "Najafgarh",
    "is_reserved_sc": false
  },
  {
    "ac_number": 36,
    "name": "Bijwasan",
    "lok_sabha": "South Delhi",
    "district": "South West",
    "ward_count": 4,
    "zone": "Najafgarh",
    "is_reserved_sc": false
  },
  {
    "ac_number": 37,
    "name": "Palam",
    "lok_sabha": "South Delhi",
    "district": "South West",
    "ward_count": 5,
    "zone": "Najafgarh",
    "is_reserved_sc": false
  },
  {
    "ac_number": 38,
    "name": "Delhi Cantonment",
    "lok_sabha": "New Delhi",
    "district": "New Delhi",
    "ward_count": 0,
    "zone": "Cantonment Board",
    "is_reserved_sc": false
  },
  {
    "ac_number": 39,
    "name": "Rajinder Nagar",
    "lok_sabha": "New Delhi",
    "district": "New Delhi",
    "ward_count": 3,
    "zone": "Karol Bagh",
    "is_reserved_sc": false
  },
  {
    "ac_number": 40,
    "name": "New Delhi",
    "lok_sabha": "New Delhi",
    "district": "New Delhi",
    "ward_count": 0,
    "zone": "NDMC",
    "is_reserved_sc": false
  },
  {
    "ac_number": 41,
    "name": "Jangpura",
    "lok_sabha": "East Delhi",
    "district": "South East",
    "ward_count": 3,
    "zone": "Central",
    "is_reserved_sc": false
  },
  {
    "ac_number": 42,
    "name": "Kasturba Nagar",
    "lok_sabha": "New Delhi",
    "district": "South",
    "ward_count": 3,
    "zone": "Central",
    "is_reserved_sc": false
  },
  {
    "ac_number": 43,
    "name": "Malviya Nagar",
    "lok_sabha": "New Delhi",
    "district": "South",
    "ward_count": 3,
    "zone": "South",
    "is_reserved_sc": false
  },
  {
    "ac_number": 44,
    "name": "R.K. Puram",
    "lok_sabha": "New Delhi",
    "district": "New Delhi",
    "ward_count": 3,
    "zone": "South",
    "is_reserved_sc": false
  },
  {
    "ac_number": 45,
    "name": "Mehrauli",
    "lok_sabha": "South Delhi",
    "district": "South",
    "ward_count": 3,
    "zone": "South",
    "is_reserved_sc": false
  },
  {
    "ac_number": 46,
    "name": "Chhatarpur",
    "lok_sabha": "South Delhi",
    "district": "South",
    "ward_count": 3,
    "zone": "South",
    "is_reserved_sc": false
  },
  {
    "ac_number": 47,
    "name": "Deoli",
    "lok_sabha": "South Delhi",
    "district": "South",
    "ward_count": 4,
    "zone": "South",
    "is_reserved_sc": true
  },
  {
    "ac_number": 48,
    "name": "Ambedkar Nagar",
    "lok_sabha": "South Delhi",
    "district": "South",
    "ward_count": 3,
    "zone": "South",
    "is_reserved_sc": true
  },
  {
    "ac_number": 49,
    "name": "Sangam Vihar",
    "lok_sabha": "South Delhi",
    "district": "South",
    "ward_count": 3,
    "zone": "South",
    "is_reserved_sc": false
  },
  {
    "ac_number": 50,
    "name": "Greater Kailash",
    "lok_sabha": "New Delhi",
    "district": "South",
    "ward_count": 4,
    "zone": "Central",
    "is_reserved_sc": false
  },
  {
    "ac_number": 51,
    "name": "Kalkaji",
    "lok_sabha": "South Delhi",
    "district": "South East",
    "ward_count": 3,
    "zone": "Central",
    "is_reserved_sc": false
  },
  {
    "ac_number": 52,
    "name": "Tughlakabad",
    "lok_sabha": "South Delhi",
    "district": "South East",
    "ward_count": 2,
    "zone": "Central",
    "is_reserved_sc": false
  },
  {
    "ac_number": 53,
    "name": "Badarpur",
    "lok_sabha": "South Delhi",
    "district": "South East",
    "ward_count": 5,
    "zone": "Central",
    "is_reserved_sc": false
  },
  {
    "ac_number": 54,
    "name": "Okhla",
    "lok_sabha": "East Delhi",
    "district": "South East",
    "ward_count": 6,
    "zone": "Central",
    "is_reserved_sc": false
  },
  {
    "ac_number": 55,
    "name": "Trilokpuri",
    "lok_sabha": "East Delhi",
    "district": "East",
    "ward_count": 3,
    "zone": "Shahdara South",
    "is_reserved_sc": true
  },
  {
    "ac_number": 56,
    "name": "Kondli",
    "lok_sabha": "East Delhi",
    "district": "East",
    "ward_count": 3,
    "zone": "Shahdara South",
    "is_reserved_sc": true
  },
  {
    "ac_number": 57,
    "name": "Patparganj",
    "lok_sabha": "East Delhi",
    "district": "East",
    "ward_count": 4,
    "zone": "Shahdara South",
    "is_reserved_sc": false
  },
  {
    "ac_number": 58,
    "name": "Laxmi Nagar",
    "lok_sabha": "East Delhi",
    "district": "East",
    "ward_count": 4,
    "zone": "Shahdara South",
    "is_reserved_sc": false
  },
  {
    "ac_number": 59,
    "name": "Vishwas Nagar",
    "lok_sabha": "East Delhi",
    "district": "Shahdara",
    "ward_count": 4,
    "zone": "Shahdara South",
    "is_reserved_sc": false
  },
  {
    "ac_number": 60,
    "name": "Krishna Nagar",
    "lok_sabha": "East Delhi",
    "district": "East",
    "ward_count": 4,
    "zone": "Shahdara South",
    "is_reserved_sc": false
  },
  {
    "ac_number": 61,
    "name": "Gandhi Nagar",
    "lok_sabha": "East Delhi",
    "district": "East",
    "ward_count": 3,
    "zone": "Shahdara South",
    "is_reserved_sc": false
  },
  {
    "ac_number": 62,
    "name": "Shahdara",
    "lok_sabha": "East Delhi",
    "district": "Shahdara",
    "ward_count": 3,
    "zone": "Shahdara North",
    "is_reserved_sc": false
  },
  {
    "ac_number": 63,
    "name": "Seemapuri",
    "lok_sabha": "North East Delhi",
    "district": "Shahdara",
    "ward_count": 4,
    "zone": "Shahdara North",
    "is_reserved_sc": true
  },
  {
    "ac_number": 64,
    "name": "Rohtas Nagar",
    "lok_sabha": "North East Delhi",
    "district": "Shahdara",
    "ward_count": 3,
    "zone": "Shahdara North",
    "is_reserved_sc": false
  },
  {
    "ac_number": 65,
    "name": "Seelampur",
    "lok_sabha": "North East Delhi",
    "district": "North East",
    "ward_count": 4,
    "zone": "Shahdara North",
    "is_reserved_sc": false
  },
  {
    "ac_number": 66,
    "name": "Ghonda",
    "lok_sabha": "North East Delhi",
    "district": "North East",
    "ward_count": 4,
    "zone": "Shahdara North",
    "is_reserved_sc": false
  },
  {
    "ac_number": 67,
    "name": "Babarpur",
    "lok_sabha": "North East Delhi",
    "district": "Shahdara",
    "ward_count": 4,
    "zone": "Shahdara North",
    "is_reserved_sc": false
  },
  {
    "ac_number": 68,
    "name": "Gokalpur",
    "lok_sabha": "North East Delhi",
    "district": "North East",
    "ward_count": 4,
    "zone": "Shahdara North",
    "is_reserved_sc": true
  },
  {
    "ac_number": 69,
    "name": "Mustafabad",
    "lok_sabha": "North East Delhi",
    "district": "North East",
    "ward_count": 5,
    "zone": "Shahdara North",
    "is_reserved_sc": false
  },
  {
    "ac_number": 70,
    "name": "Karawal Nagar",
    "lok_sabha": "North East Delhi",
    "district": "North East",
    "ward_count": 5,
    "zone": "Shahdara North",
    "is_reserved_sc": false
  }
];

export const MCD_WARDS: MCDWard[] = [
  {
    "ward_number": 1,
    "name": "Narela",
    "raw_name": "Narela (W)",
    "ac_number": 1,
    "ac_name": "Narela",
    "lok_sabha": "North West Delhi",
    "district": "North",
    "zone": "Narela",
    "reservation": "WOMEN"
  },
  {
    "ward_number": 2,
    "name": "Bankner",
    "raw_name": "Bankner",
    "ac_number": 1,
    "ac_name": "Narela",
    "lok_sabha": "North West Delhi",
    "district": "North",
    "zone": "Narela",
    "reservation": "GEN"
  },
  {
    "ward_number": 3,
    "name": "Holambi Kalan",
    "raw_name": "Holambi Kalan (W)",
    "ac_number": 1,
    "ac_name": "Narela",
    "lok_sabha": "North West Delhi",
    "district": "North",
    "zone": "Narela",
    "reservation": "WOMEN"
  },
  {
    "ward_number": 4,
    "name": "Alipur",
    "raw_name": "Alipur",
    "ac_number": 1,
    "ac_name": "Narela",
    "lok_sabha": "North West Delhi",
    "district": "North",
    "zone": "Narela",
    "reservation": "GEN"
  },
  {
    "ward_number": 5,
    "name": "Bakhtawarpur",
    "raw_name": "Bakhtawarpur (W)",
    "ac_number": 1,
    "ac_name": "Narela",
    "lok_sabha": "North West Delhi",
    "district": "North",
    "zone": "Narela",
    "reservation": "WOMEN"
  },
  {
    "ward_number": 6,
    "name": "Burari",
    "raw_name": "Burari",
    "ac_number": 2,
    "ac_name": "Burari",
    "lok_sabha": "North East Delhi",
    "district": "Central",
    "zone": "Civil Lines",
    "reservation": "GEN"
  },
  {
    "ward_number": 7,
    "name": "Kadipur",
    "raw_name": "Kadipur (W)",
    "ac_number": 2,
    "ac_name": "Burari",
    "lok_sabha": "North East Delhi",
    "district": "Central",
    "zone": "Civil Lines",
    "reservation": "WOMEN"
  },
  {
    "ward_number": 8,
    "name": "Mukundpur",
    "raw_name": "Mukundpur",
    "ac_number": 2,
    "ac_name": "Burari",
    "lok_sabha": "North East Delhi",
    "district": "Central",
    "zone": "Civil Lines",
    "reservation": "GEN"
  },
  {
    "ward_number": 9,
    "name": "Sant Nagar",
    "raw_name": "Sant Nagar (W)",
    "ac_number": 2,
    "ac_name": "Burari",
    "lok_sabha": "North East Delhi",
    "district": "Central",
    "zone": "Civil Lines",
    "reservation": "WOMEN"
  },
  {
    "ward_number": 10,
    "name": "Jharoda",
    "raw_name": "Jharoda",
    "ac_number": 2,
    "ac_name": "Burari",
    "lok_sabha": "North East Delhi",
    "district": "Central",
    "zone": "Civil Lines",
    "reservation": "GEN"
  },
  {
    "ward_number": 11,
    "name": "Timarpur",
    "raw_name": "Timarpur (W)",
    "ac_number": 3,
    "ac_name": "Timarpur",
    "lok_sabha": "North East Delhi",
    "district": "Central",
    "zone": "Civil Lines",
    "reservation": "WOMEN"
  },
  {
    "ward_number": 12,
    "name": "Malka Ganj",
    "raw_name": "Malka Ganj (SC-W)",
    "ac_number": 3,
    "ac_name": "Timarpur",
    "lok_sabha": "North East Delhi",
    "district": "Central",
    "zone": "Civil Lines",
    "reservation": "SC_WOMEN"
  },
  {
    "ward_number": 13,
    "name": "Mukherjee Nagar",
    "raw_name": "Mukherjee Nagar",
    "ac_number": 3,
    "ac_name": "Timarpur",
    "lok_sabha": "North East Delhi",
    "district": "Central",
    "zone": "Civil Lines",
    "reservation": "GEN"
  },
  {
    "ward_number": 14,
    "name": "Dhirpur",
    "raw_name": "Dhirpur (W)",
    "ac_number": 4,
    "ac_name": "Adarsh Nagar",
    "lok_sabha": "Chandni Chowk",
    "district": "North",
    "zone": "Civil Lines",
    "reservation": "WOMEN"
  },
  {
    "ward_number": 15,
    "name": "Adarsh Nagar",
    "raw_name": "Adarsh Nagar",
    "ac_number": 4,
    "ac_name": "Adarsh Nagar",
    "lok_sabha": "Chandni Chowk",
    "district": "North",
    "zone": "Civil Lines",
    "reservation": "GEN"
  },
  {
    "ward_number": 16,
    "name": "Azadpur",
    "raw_name": "Azadpur (W)",
    "ac_number": 4,
    "ac_name": "Adarsh Nagar",
    "lok_sabha": "Chandni Chowk",
    "district": "North",
    "zone": "Civil Lines",
    "reservation": "WOMEN"
  },
  {
    "ward_number": 17,
    "name": "Bhalswa",
    "raw_name": "Bhalswa",
    "ac_number": 5,
    "ac_name": "Badli",
    "lok_sabha": "North West Delhi",
    "district": "North",
    "zone": "Civil Lines",
    "reservation": "GEN"
  },
  {
    "ward_number": 18,
    "name": "Jahangir Puri",
    "raw_name": "Jahangir Puri (W)",
    "ac_number": 5,
    "ac_name": "Badli",
    "lok_sabha": "North West Delhi",
    "district": "North",
    "zone": "Civil Lines",
    "reservation": "WOMEN"
  },
  {
    "ward_number": 19,
    "name": "Sarup Nagar",
    "raw_name": "Sarup Nagar",
    "ac_number": 5,
    "ac_name": "Badli",
    "lok_sabha": "North West Delhi",
    "district": "North",
    "zone": "Civil Lines",
    "reservation": "GEN"
  },
  {
    "ward_number": 20,
    "name": "Samaypur Badli",
    "raw_name": "Samaypur Badli (W)",
    "ac_number": 5,
    "ac_name": "Badli",
    "lok_sabha": "North West Delhi",
    "district": "North",
    "zone": "Civil Lines",
    "reservation": "WOMEN"
  },
  {
    "ward_number": 21,
    "name": "Rohini-A",
    "raw_name": "Rohini-A",
    "ac_number": 6,
    "ac_name": "Rithala",
    "lok_sabha": "North West Delhi",
    "district": "North West",
    "zone": "Rohini",
    "reservation": "GEN"
  },
  {
    "ward_number": 22,
    "name": "Rohini-B",
    "raw_name": "Rohini-B (W)",
    "ac_number": 6,
    "ac_name": "Rithala",
    "lok_sabha": "North West Delhi",
    "district": "North West",
    "zone": "Rohini",
    "reservation": "WOMEN"
  },
  {
    "ward_number": 23,
    "name": "Rithala",
    "raw_name": "Rithala",
    "ac_number": 6,
    "ac_name": "Rithala",
    "lok_sabha": "North West Delhi",
    "district": "North West",
    "zone": "Rohini",
    "reservation": "GEN"
  },
  {
    "ward_number": 24,
    "name": "Vijay Vihar",
    "raw_name": "Vijay Vihar (W)",
    "ac_number": 6,
    "ac_name": "Rithala",
    "lok_sabha": "North West Delhi",
    "district": "North West",
    "zone": "Rohini",
    "reservation": "WOMEN"
  },
  {
    "ward_number": 25,
    "name": "Budh Vihar",
    "raw_name": "Budh Vihar",
    "ac_number": 6,
    "ac_name": "Rithala",
    "lok_sabha": "North West Delhi",
    "district": "North West",
    "zone": "Rohini",
    "reservation": "GEN"
  },
  {
    "ward_number": 26,
    "name": "Pooth Kalan",
    "raw_name": "Pooth Kalan (W)",
    "ac_number": 7,
    "ac_name": "Bawana",
    "lok_sabha": "North West Delhi",
    "district": "North",
    "zone": "Narela",
    "reservation": "WOMEN"
  },
  {
    "ward_number": 27,
    "name": "Begumpur",
    "raw_name": "Begumpur",
    "ac_number": 7,
    "ac_name": "Bawana",
    "lok_sabha": "North West Delhi",
    "district": "North",
    "zone": "Narela",
    "reservation": "GEN"
  },
  {
    "ward_number": 28,
    "name": "Shahbaad Dairy",
    "raw_name": "Shahbaad Dairy (SC)",
    "ac_number": 7,
    "ac_name": "Bawana",
    "lok_sabha": "North West Delhi",
    "district": "North",
    "zone": "Narela",
    "reservation": "SC"
  },
  {
    "ward_number": 29,
    "name": "Pooth Khurd",
    "raw_name": "Pooth Khurd (W)",
    "ac_number": 7,
    "ac_name": "Bawana",
    "lok_sabha": "North West Delhi",
    "district": "North",
    "zone": "Narela",
    "reservation": "WOMEN"
  },
  {
    "ward_number": 30,
    "name": "Bawana",
    "raw_name": "Bawana",
    "ac_number": 7,
    "ac_name": "Bawana",
    "lok_sabha": "North West Delhi",
    "district": "North",
    "zone": "Narela",
    "reservation": "GEN"
  },
  {
    "ward_number": 31,
    "name": "Nangal Thakran",
    "raw_name": "Nangal Thakran (W)",
    "ac_number": 7,
    "ac_name": "Bawana",
    "lok_sabha": "North West Delhi",
    "district": "North",
    "zone": "Narela",
    "reservation": "WOMEN"
  },
  {
    "ward_number": 32,
    "name": "Kanjhawala",
    "raw_name": "Kanjhawala",
    "ac_number": 8,
    "ac_name": "Mundka",
    "lok_sabha": "North West Delhi",
    "district": "West",
    "zone": "Narela",
    "reservation": "GEN"
  },
  {
    "ward_number": 33,
    "name": "Rani Khera",
    "raw_name": "Rani Khera (W)",
    "ac_number": 8,
    "ac_name": "Mundka",
    "lok_sabha": "North West Delhi",
    "district": "West",
    "zone": "Narela",
    "reservation": "WOMEN"
  },
  {
    "ward_number": 34,
    "name": "Nangloi",
    "raw_name": "Nangloi (SC-W)",
    "ac_number": 8,
    "ac_name": "Mundka",
    "lok_sabha": "North West Delhi",
    "district": "West",
    "zone": "Narela",
    "reservation": "SC_WOMEN"
  },
  {
    "ward_number": 35,
    "name": "Mundka",
    "raw_name": "Mundka",
    "ac_number": 8,
    "ac_name": "Mundka",
    "lok_sabha": "North West Delhi",
    "district": "West",
    "zone": "Narela",
    "reservation": "GEN"
  },
  {
    "ward_number": 36,
    "name": "Nilothi",
    "raw_name": "Nilothi (W)",
    "ac_number": 8,
    "ac_name": "Mundka",
    "lok_sabha": "North West Delhi",
    "district": "West",
    "zone": "Narela",
    "reservation": "WOMEN"
  },
  {
    "ward_number": 37,
    "name": "Kirari",
    "raw_name": "Kirari",
    "ac_number": 9,
    "ac_name": "Kirari",
    "lok_sabha": "North West Delhi",
    "district": "North West",
    "zone": "Rohini",
    "reservation": "GEN"
  },
  {
    "ward_number": 38,
    "name": "Prem Nagar",
    "raw_name": "Prem Nagar (W)",
    "ac_number": 9,
    "ac_name": "Kirari",
    "lok_sabha": "North West Delhi",
    "district": "North West",
    "zone": "Rohini",
    "reservation": "WOMEN"
  },
  {
    "ward_number": 39,
    "name": "Mubarikpur",
    "raw_name": "Mubarikpur",
    "ac_number": 9,
    "ac_name": "Kirari",
    "lok_sabha": "North West Delhi",
    "district": "North West",
    "zone": "Rohini",
    "reservation": "GEN"
  },
  {
    "ward_number": 40,
    "name": "Nithari",
    "raw_name": "Nithari (W)",
    "ac_number": 9,
    "ac_name": "Kirari",
    "lok_sabha": "North West Delhi",
    "district": "North West",
    "zone": "Rohini",
    "reservation": "WOMEN"
  },
  {
    "ward_number": 41,
    "name": "Aman Vihar",
    "raw_name": "Aman Vihar",
    "ac_number": 9,
    "ac_name": "Kirari",
    "lok_sabha": "North West Delhi",
    "district": "North West",
    "zone": "Rohini",
    "reservation": "GEN"
  },
  {
    "ward_number": 42,
    "name": "Mangol Puri",
    "raw_name": "Mangol Puri (SC)",
    "ac_number": 10,
    "ac_name": "Sultan Pur Majra",
    "lok_sabha": "North West Delhi",
    "district": "North West",
    "zone": "Rohini",
    "reservation": "SC"
  },
  {
    "ward_number": 43,
    "name": "Sultanpuri-A",
    "raw_name": "Sultanpuri-A (SC-W)",
    "ac_number": 10,
    "ac_name": "Sultan Pur Majra",
    "lok_sabha": "North West Delhi",
    "district": "North West",
    "zone": "Rohini",
    "reservation": "SC_WOMEN"
  },
  {
    "ward_number": 44,
    "name": "Sultanpuri-B",
    "raw_name": "Sultanpuri-B (SC)",
    "ac_number": 10,
    "ac_name": "Sultan Pur Majra",
    "lok_sabha": "North West Delhi",
    "district": "North West",
    "zone": "Rohini",
    "reservation": "SC"
  },
  {
    "ward_number": 45,
    "name": "Jawalapuri",
    "raw_name": "Jawalapuri (SC-W)",
    "ac_number": 11,
    "ac_name": "Nangloi Jat",
    "lok_sabha": "North West Delhi",
    "district": "West",
    "zone": "West",
    "reservation": "SC_WOMEN"
  },
  {
    "ward_number": 46,
    "name": "Nangloi Jat",
    "raw_name": "Nangloi Jat (W)",
    "ac_number": 11,
    "ac_name": "Nangloi Jat",
    "lok_sabha": "North West Delhi",
    "district": "West",
    "zone": "West",
    "reservation": "WOMEN"
  },
  {
    "ward_number": 47,
    "name": "Nihal Vihar",
    "raw_name": "Nihal Vihar",
    "ac_number": 11,
    "ac_name": "Nangloi Jat",
    "lok_sabha": "North West Delhi",
    "district": "West",
    "zone": "West",
    "reservation": "GEN"
  },
  {
    "ward_number": 48,
    "name": "Guru Harkishan Nagar",
    "raw_name": "Guru Harkishan Nagar (W)",
    "ac_number": 11,
    "ac_name": "Nangloi Jat",
    "lok_sabha": "North West Delhi",
    "district": "West",
    "zone": "West",
    "reservation": "WOMEN"
  },
  {
    "ward_number": 49,
    "name": "Mangolpuri-A",
    "raw_name": "Mangolpuri-A (SC)",
    "ac_number": 12,
    "ac_name": "Mangol Puri",
    "lok_sabha": "North West Delhi",
    "district": "North West",
    "zone": "Rohini",
    "reservation": "SC"
  },
  {
    "ward_number": 50,
    "name": "Mangolpuri-B",
    "raw_name": "Mangolpuri-B (SC-W)",
    "ac_number": 12,
    "ac_name": "Mangol Puri",
    "lok_sabha": "North West Delhi",
    "district": "North West",
    "zone": "Rohini",
    "reservation": "SC_WOMEN"
  },
  {
    "ward_number": 51,
    "name": "Rohini-C",
    "raw_name": "Rohini-C",
    "ac_number": 12,
    "ac_name": "Mangol Puri",
    "lok_sabha": "North West Delhi",
    "district": "North West",
    "zone": "Rohini",
    "reservation": "GEN"
  },
  {
    "ward_number": 52,
    "name": "Rohini-F",
    "raw_name": "Rohini-F (W)",
    "ac_number": 13,
    "ac_name": "Rohini",
    "lok_sabha": "North West Delhi",
    "district": "North West",
    "zone": "Rohini",
    "reservation": "WOMEN"
  },
  {
    "ward_number": 53,
    "name": "Rohini-E",
    "raw_name": "Rohini-E",
    "ac_number": 13,
    "ac_name": "Rohini",
    "lok_sabha": "North West Delhi",
    "district": "North West",
    "zone": "Rohini",
    "reservation": "GEN"
  },
  {
    "ward_number": 54,
    "name": "Rohini-D",
    "raw_name": "Rohini-D (W)",
    "ac_number": 13,
    "ac_name": "Rohini",
    "lok_sabha": "North West Delhi",
    "district": "North West",
    "zone": "Rohini",
    "reservation": "WOMEN"
  },
  {
    "ward_number": 55,
    "name": "Shalimar Bagh-A",
    "raw_name": "Shalimar Bagh-A",
    "ac_number": 14,
    "ac_name": "Shalimar Bagh",
    "lok_sabha": "Chandni Chowk",
    "district": "North West",
    "zone": "Keshav Puram",
    "reservation": "GEN"
  },
  {
    "ward_number": 56,
    "name": "Shalimar Bagh-B",
    "raw_name": "Shalimar Bagh-B (W)",
    "ac_number": 14,
    "ac_name": "Shalimar Bagh",
    "lok_sabha": "Chandni Chowk",
    "district": "North West",
    "zone": "Keshav Puram",
    "reservation": "WOMEN"
  },
  {
    "ward_number": 57,
    "name": "Pitam Pura",
    "raw_name": "Pitam Pura",
    "ac_number": 14,
    "ac_name": "Shalimar Bagh",
    "lok_sabha": "Chandni Chowk",
    "district": "North West",
    "zone": "Keshav Puram",
    "reservation": "GEN"
  },
  {
    "ward_number": 58,
    "name": "Saraswati Vihar",
    "raw_name": "Saraswati Vihar (W)",
    "ac_number": 15,
    "ac_name": "Shakur Basti",
    "lok_sabha": "Chandni Chowk",
    "district": "North",
    "zone": "Keshav Puram",
    "reservation": "WOMEN"
  },
  {
    "ward_number": 59,
    "name": "Paschim Vihar",
    "raw_name": "Paschim Vihar",
    "ac_number": 15,
    "ac_name": "Shakur Basti",
    "lok_sabha": "Chandni Chowk",
    "district": "North",
    "zone": "Keshav Puram",
    "reservation": "GEN"
  },
  {
    "ward_number": 60,
    "name": "Rani Bagh",
    "raw_name": "Rani Bagh (W)",
    "ac_number": 15,
    "ac_name": "Shakur Basti",
    "lok_sabha": "Chandni Chowk",
    "district": "North",
    "zone": "Keshav Puram",
    "reservation": "WOMEN"
  },
  {
    "ward_number": 61,
    "name": "Kohat Enclave",
    "raw_name": "Kohat Enclave",
    "ac_number": 15,
    "ac_name": "Shakur Basti",
    "lok_sabha": "Chandni Chowk",
    "district": "North",
    "zone": "Keshav Puram",
    "reservation": "GEN"
  },
  {
    "ward_number": 62,
    "name": "Shakur Pur",
    "raw_name": "Shakur Pur (SC)",
    "ac_number": 16,
    "ac_name": "Tri Nagar",
    "lok_sabha": "Chandni Chowk",
    "district": "North",
    "zone": "Keshav Puram",
    "reservation": "SC"
  },
  {
    "ward_number": 63,
    "name": "Tri Nagar",
    "raw_name": "Tri Nagar (W)",
    "ac_number": 16,
    "ac_name": "Tri Nagar",
    "lok_sabha": "Chandni Chowk",
    "district": "North",
    "zone": "Keshav Puram",
    "reservation": "WOMEN"
  },
  {
    "ward_number": 64,
    "name": "Keshav Puram",
    "raw_name": "Keshav Puram",
    "ac_number": 16,
    "ac_name": "Tri Nagar",
    "lok_sabha": "Chandni Chowk",
    "district": "North",
    "zone": "Keshav Puram",
    "reservation": "GEN"
  },
  {
    "ward_number": 65,
    "name": "Ashok Vihar",
    "raw_name": "Ashok Vihar (W)",
    "ac_number": 17,
    "ac_name": "Wazirpur",
    "lok_sabha": "Chandni Chowk",
    "district": "North",
    "zone": "Keshav Puram",
    "reservation": "WOMEN"
  },
  {
    "ward_number": 66,
    "name": "Wazir Pur",
    "raw_name": "Wazir Pur (SC-W)",
    "ac_number": 17,
    "ac_name": "Wazirpur",
    "lok_sabha": "Chandni Chowk",
    "district": "North",
    "zone": "Keshav Puram",
    "reservation": "SC_WOMEN"
  },
  {
    "ward_number": 67,
    "name": "Sangam Park",
    "raw_name": "Sangam Park (SC)",
    "ac_number": 18,
    "ac_name": "Model Town",
    "lok_sabha": "Chandni Chowk",
    "district": "North",
    "zone": "Civil Lines",
    "reservation": "SC"
  },
  {
    "ward_number": 68,
    "name": "Model Town",
    "raw_name": "Model Town",
    "ac_number": 18,
    "ac_name": "Model Town",
    "lok_sabha": "Chandni Chowk",
    "district": "North",
    "zone": "Civil Lines",
    "reservation": "GEN"
  },
  {
    "ward_number": 69,
    "name": "Kamla Nagar",
    "raw_name": "Kamla Nagar (W)",
    "ac_number": 18,
    "ac_name": "Model Town",
    "lok_sabha": "Chandni Chowk",
    "district": "North",
    "zone": "Civil Lines",
    "reservation": "WOMEN"
  },
  {
    "ward_number": 70,
    "name": "Shastri Nagar",
    "raw_name": "Shastri Nagar",
    "ac_number": 19,
    "ac_name": "Sadar Bazar",
    "lok_sabha": "Chandni Chowk",
    "district": "Central",
    "zone": "City SP",
    "reservation": "GEN"
  },
  {
    "ward_number": 71,
    "name": "Kishan Ganj",
    "raw_name": "Kishan Ganj (SC-W)",
    "ac_number": 19,
    "ac_name": "Sadar Bazar",
    "lok_sabha": "Chandni Chowk",
    "district": "Central",
    "zone": "City SP",
    "reservation": "SC_WOMEN"
  },
  {
    "ward_number": 72,
    "name": "Sadar Bazar",
    "raw_name": "Sadar Bazar (W)",
    "ac_number": 19,
    "ac_name": "Sadar Bazar",
    "lok_sabha": "Chandni Chowk",
    "district": "Central",
    "zone": "City SP",
    "reservation": "WOMEN"
  },
  {
    "ward_number": 73,
    "name": "Civil Lines",
    "raw_name": "Civil Lines (SC)",
    "ac_number": 19,
    "ac_name": "Sadar Bazar",
    "lok_sabha": "Chandni Chowk",
    "district": "Central",
    "zone": "City SP",
    "reservation": "SC"
  },
  {
    "ward_number": 74,
    "name": "Chandni Chowk",
    "raw_name": "Chandni Chowk",
    "ac_number": 20,
    "ac_name": "Chandni Chowk",
    "lok_sabha": "Chandni Chowk",
    "district": "Central",
    "zone": "City SP",
    "reservation": "GEN"
  },
  {
    "ward_number": 75,
    "name": "Jama Masjid",
    "raw_name": "Jama Masjid (W)",
    "ac_number": 20,
    "ac_name": "Chandni Chowk",
    "lok_sabha": "Chandni Chowk",
    "district": "Central",
    "zone": "City SP",
    "reservation": "WOMEN"
  },
  {
    "ward_number": 76,
    "name": "Chandani Mahal",
    "raw_name": "Chandani Mahal",
    "ac_number": 20,
    "ac_name": "Chandni Chowk",
    "lok_sabha": "Chandni Chowk",
    "district": "Central",
    "zone": "City SP",
    "reservation": "GEN"
  },
  {
    "ward_number": 77,
    "name": "Delhi Gate",
    "raw_name": "Delhi Gate (SC-W)",
    "ac_number": 21,
    "ac_name": "Matia Mahal",
    "lok_sabha": "Chandni Chowk",
    "district": "Central",
    "zone": "City SP",
    "reservation": "SC_WOMEN"
  },
  {
    "ward_number": 78,
    "name": "Bazar Sita Ram",
    "raw_name": "Bazar Sita Ram (W)",
    "ac_number": 21,
    "ac_name": "Matia Mahal",
    "lok_sabha": "Chandni Chowk",
    "district": "Central",
    "zone": "City SP",
    "reservation": "WOMEN"
  },
  {
    "ward_number": 79,
    "name": "Ballimaran",
    "raw_name": "Ballimaran",
    "ac_number": 22,
    "ac_name": "Ballimaran",
    "lok_sabha": "Chandni Chowk",
    "district": "Central",
    "zone": "City SP",
    "reservation": "GEN"
  },
  {
    "ward_number": 80,
    "name": "Ram Nagar",
    "raw_name": "Ram Nagar (SC)",
    "ac_number": 22,
    "ac_name": "Ballimaran",
    "lok_sabha": "Chandni Chowk",
    "district": "Central",
    "zone": "City SP",
    "reservation": "SC"
  },
  {
    "ward_number": 81,
    "name": "Quraish Nagar",
    "raw_name": "Quraish Nagar (W)",
    "ac_number": 22,
    "ac_name": "Ballimaran",
    "lok_sabha": "Chandni Chowk",
    "district": "Central",
    "zone": "City SP",
    "reservation": "WOMEN"
  },
  {
    "ward_number": 82,
    "name": "Pahar Ganj",
    "raw_name": "Pahar Ganj",
    "ac_number": 23,
    "ac_name": "Karol Bagh",
    "lok_sabha": "New Delhi",
    "district": "Central",
    "zone": "Karol Bagh",
    "reservation": "GEN"
  },
  {
    "ward_number": 83,
    "name": "Karol Bagh",
    "raw_name": "Karol Bagh (SC-W)",
    "ac_number": 23,
    "ac_name": "Karol Bagh",
    "lok_sabha": "New Delhi",
    "district": "Central",
    "zone": "Karol Bagh",
    "reservation": "SC_WOMEN"
  },
  {
    "ward_number": 84,
    "name": "Dev Nagar",
    "raw_name": "Dev Nagar (SC)",
    "ac_number": 23,
    "ac_name": "Karol Bagh",
    "lok_sabha": "New Delhi",
    "district": "Central",
    "zone": "Karol Bagh",
    "reservation": "SC"
  },
  {
    "ward_number": 85,
    "name": "West Patel Nagar",
    "raw_name": "West Patel Nagar (SC-W)",
    "ac_number": 24,
    "ac_name": "Patel Nagar",
    "lok_sabha": "New Delhi",
    "district": "Central",
    "zone": "Karol Bagh",
    "reservation": "SC_WOMEN"
  },
  {
    "ward_number": 86,
    "name": "East Patel Nagar",
    "raw_name": "East Patel Nagar (W)",
    "ac_number": 24,
    "ac_name": "Patel Nagar",
    "lok_sabha": "New Delhi",
    "district": "Central",
    "zone": "Karol Bagh",
    "reservation": "WOMEN"
  },
  {
    "ward_number": 87,
    "name": "Ranjeet Nagar",
    "raw_name": "Ranjeet Nagar",
    "ac_number": 24,
    "ac_name": "Patel Nagar",
    "lok_sabha": "New Delhi",
    "district": "Central",
    "zone": "Karol Bagh",
    "reservation": "GEN"
  },
  {
    "ward_number": 88,
    "name": "Baljeet Nagar",
    "raw_name": "Baljeet Nagar (W)",
    "ac_number": 24,
    "ac_name": "Patel Nagar",
    "lok_sabha": "New Delhi",
    "district": "Central",
    "zone": "Karol Bagh",
    "reservation": "WOMEN"
  },
  {
    "ward_number": 89,
    "name": "Karam Pura",
    "raw_name": "Karam Pura",
    "ac_number": 25,
    "ac_name": "Moti Nagar",
    "lok_sabha": "New Delhi",
    "district": "West",
    "zone": "Karol Bagh",
    "reservation": "GEN"
  },
  {
    "ward_number": 90,
    "name": "Moti Nagar",
    "raw_name": "Moti Nagar (W)",
    "ac_number": 25,
    "ac_name": "Moti Nagar",
    "lok_sabha": "New Delhi",
    "district": "West",
    "zone": "Karol Bagh",
    "reservation": "WOMEN"
  },
  {
    "ward_number": 91,
    "name": "Ramesh Nagar",
    "raw_name": "Ramesh Nagar",
    "ac_number": 25,
    "ac_name": "Moti Nagar",
    "lok_sabha": "New Delhi",
    "district": "West",
    "zone": "Karol Bagh",
    "reservation": "GEN"
  },
  {
    "ward_number": 92,
    "name": "Punjabi Bagh",
    "raw_name": "Punjabi Bagh (W)",
    "ac_number": 25,
    "ac_name": "Moti Nagar",
    "lok_sabha": "New Delhi",
    "district": "West",
    "zone": "Karol Bagh",
    "reservation": "WOMEN"
  },
  {
    "ward_number": 93,
    "name": "Madipur",
    "raw_name": "Madipur (SC)",
    "ac_number": 26,
    "ac_name": "Madipur",
    "lok_sabha": "West Delhi",
    "district": "West",
    "zone": "West",
    "reservation": "SC"
  },
  {
    "ward_number": 94,
    "name": "Raghubir Nagar",
    "raw_name": "Raghubir Nagar (SC-W)",
    "ac_number": 26,
    "ac_name": "Madipur",
    "lok_sabha": "West Delhi",
    "district": "West",
    "zone": "West",
    "reservation": "SC_WOMEN"
  },
  {
    "ward_number": 95,
    "name": "Vishnu Garden",
    "raw_name": "Vishnu Garden",
    "ac_number": 26,
    "ac_name": "Madipur",
    "lok_sabha": "West Delhi",
    "district": "West",
    "zone": "West",
    "reservation": "GEN"
  },
  {
    "ward_number": 96,
    "name": "Rajouri Garden",
    "raw_name": "Rajouri Garden (W)",
    "ac_number": 27,
    "ac_name": "Rajouri Garden",
    "lok_sabha": "West Delhi",
    "district": "West",
    "zone": "West",
    "reservation": "WOMEN"
  },
  {
    "ward_number": 97,
    "name": "Chaukhandi Nagar",
    "raw_name": "Chaukhandi Nagar",
    "ac_number": 27,
    "ac_name": "Rajouri Garden",
    "lok_sabha": "West Delhi",
    "district": "West",
    "zone": "West",
    "reservation": "GEN"
  },
  {
    "ward_number": 98,
    "name": "Subhash Nagar",
    "raw_name": "Subhash Nagar (W)",
    "ac_number": 27,
    "ac_name": "Rajouri Garden",
    "lok_sabha": "West Delhi",
    "district": "West",
    "zone": "West",
    "reservation": "WOMEN"
  },
  {
    "ward_number": 99,
    "name": "Hari Nagar",
    "raw_name": "Hari Nagar",
    "ac_number": 28,
    "ac_name": "Hari Nagar",
    "lok_sabha": "West Delhi",
    "district": "West",
    "zone": "West",
    "reservation": "GEN"
  },
  {
    "ward_number": 100,
    "name": "Fateh Nagar",
    "raw_name": "Fateh Nagar (W)",
    "ac_number": 28,
    "ac_name": "Hari Nagar",
    "lok_sabha": "West Delhi",
    "district": "West",
    "zone": "West",
    "reservation": "WOMEN"
  },
  {
    "ward_number": 101,
    "name": "Tilak Nagar",
    "raw_name": "Tilak Nagar",
    "ac_number": 28,
    "ac_name": "Hari Nagar",
    "lok_sabha": "West Delhi",
    "district": "West",
    "zone": "West",
    "reservation": "GEN"
  },
  {
    "ward_number": 102,
    "name": "Khyala",
    "raw_name": "Khyala (W)",
    "ac_number": 28,
    "ac_name": "Hari Nagar",
    "lok_sabha": "West Delhi",
    "district": "West",
    "zone": "West",
    "reservation": "WOMEN"
  },
  {
    "ward_number": 103,
    "name": "Keshopur",
    "raw_name": "Keshopur",
    "ac_number": 29,
    "ac_name": "Tilak Nagar",
    "lok_sabha": "West Delhi",
    "district": "West",
    "zone": "West",
    "reservation": "GEN"
  },
  {
    "ward_number": 104,
    "name": "Janak Puri South",
    "raw_name": "Janak Puri South (W)",
    "ac_number": 29,
    "ac_name": "Tilak Nagar",
    "lok_sabha": "West Delhi",
    "district": "West",
    "zone": "West",
    "reservation": "WOMEN"
  },
  {
    "ward_number": 105,
    "name": "Mahaveer Enclave",
    "raw_name": "Mahaveer Enclave",
    "ac_number": 29,
    "ac_name": "Tilak Nagar",
    "lok_sabha": "West Delhi",
    "district": "West",
    "zone": "West",
    "reservation": "GEN"
  },
  {
    "ward_number": 106,
    "name": "Janak Puri West",
    "raw_name": "Janak Puri West (W)",
    "ac_number": 30,
    "ac_name": "Janakpuri",
    "lok_sabha": "West Delhi",
    "district": "West",
    "zone": "West",
    "reservation": "WOMEN"
  },
  {
    "ward_number": 107,
    "name": "Vikas Puri",
    "raw_name": "Vikas Puri",
    "ac_number": 30,
    "ac_name": "Janakpuri",
    "lok_sabha": "West Delhi",
    "district": "West",
    "zone": "West",
    "reservation": "GEN"
  },
  {
    "ward_number": 108,
    "name": "Hastsal",
    "raw_name": "Hastsal (W)",
    "ac_number": 30,
    "ac_name": "Janakpuri",
    "lok_sabha": "West Delhi",
    "district": "West",
    "zone": "West",
    "reservation": "WOMEN"
  },
  {
    "ward_number": 109,
    "name": "Shiv Vihar",
    "raw_name": "Shiv Vihar",
    "ac_number": 31,
    "ac_name": "Vikas Puri",
    "lok_sabha": "West Delhi",
    "district": "West",
    "zone": "West",
    "reservation": "GEN"
  },
  {
    "ward_number": 110,
    "name": "Bhakkar Wala",
    "raw_name": "Bhakkar Wala (W)",
    "ac_number": 31,
    "ac_name": "Vikas Puri",
    "lok_sabha": "West Delhi",
    "district": "West",
    "zone": "West",
    "reservation": "WOMEN"
  },
  {
    "ward_number": 111,
    "name": "Baprola",
    "raw_name": "Baprola",
    "ac_number": 31,
    "ac_name": "Vikas Puri",
    "lok_sabha": "West Delhi",
    "district": "West",
    "zone": "West",
    "reservation": "GEN"
  },
  {
    "ward_number": 112,
    "name": "Vikas Nagar",
    "raw_name": "Vikas Nagar (W)",
    "ac_number": 31,
    "ac_name": "Vikas Puri",
    "lok_sabha": "West Delhi",
    "district": "West",
    "zone": "West",
    "reservation": "WOMEN"
  },
  {
    "ward_number": 113,
    "name": "Mohan Garden-West",
    "raw_name": "Mohan Garden-West",
    "ac_number": 31,
    "ac_name": "Vikas Puri",
    "lok_sabha": "West Delhi",
    "district": "West",
    "zone": "West",
    "reservation": "GEN"
  },
  {
    "ward_number": 114,
    "name": "Mohan Garden-East",
    "raw_name": "Mohan Garden-East (W)",
    "ac_number": 31,
    "ac_name": "Vikas Puri",
    "lok_sabha": "West Delhi",
    "district": "West",
    "zone": "West",
    "reservation": "WOMEN"
  },
  {
    "ward_number": 115,
    "name": "Uttam Nagar",
    "raw_name": "Uttam Nagar",
    "ac_number": 32,
    "ac_name": "Uttam Nagar",
    "lok_sabha": "West Delhi",
    "district": "South West",
    "zone": "Najafgarh",
    "reservation": "GEN"
  },
  {
    "ward_number": 116,
    "name": "Binda Pur",
    "raw_name": "Binda Pur (W)",
    "ac_number": 32,
    "ac_name": "Uttam Nagar",
    "lok_sabha": "West Delhi",
    "district": "South West",
    "zone": "Najafgarh",
    "reservation": "WOMEN"
  },
  {
    "ward_number": 117,
    "name": "Dabri",
    "raw_name": "Dabri",
    "ac_number": 32,
    "ac_name": "Uttam Nagar",
    "lok_sabha": "West Delhi",
    "district": "South West",
    "zone": "Najafgarh",
    "reservation": "GEN"
  },
  {
    "ward_number": 118,
    "name": "Sagarpur",
    "raw_name": "Sagarpur (W)",
    "ac_number": 33,
    "ac_name": "Dwarka",
    "lok_sabha": "West Delhi",
    "district": "South West",
    "zone": "Najafgarh",
    "reservation": "WOMEN"
  },
  {
    "ward_number": 119,
    "name": "Manglapuri",
    "raw_name": "Manglapuri",
    "ac_number": 33,
    "ac_name": "Dwarka",
    "lok_sabha": "West Delhi",
    "district": "South West",
    "zone": "Najafgarh",
    "reservation": "GEN"
  },
  {
    "ward_number": 120,
    "name": "Dwarka-B",
    "raw_name": "Dwarka-B (W)",
    "ac_number": 33,
    "ac_name": "Dwarka",
    "lok_sabha": "West Delhi",
    "district": "South West",
    "zone": "Najafgarh",
    "reservation": "WOMEN"
  },
  {
    "ward_number": 121,
    "name": "Dwarka-A",
    "raw_name": "Dwarka-A",
    "ac_number": 34,
    "ac_name": "Matiala",
    "lok_sabha": "West Delhi",
    "district": "South West",
    "zone": "Najafgarh",
    "reservation": "GEN"
  },
  {
    "ward_number": 122,
    "name": "Matiala",
    "raw_name": "Matiala (W)",
    "ac_number": 34,
    "ac_name": "Matiala",
    "lok_sabha": "West Delhi",
    "district": "South West",
    "zone": "Najafgarh",
    "reservation": "WOMEN"
  },
  {
    "ward_number": 123,
    "name": "Kakrola",
    "raw_name": "Kakrola",
    "ac_number": 34,
    "ac_name": "Matiala",
    "lok_sabha": "West Delhi",
    "district": "South West",
    "zone": "Najafgarh",
    "reservation": "GEN"
  },
  {
    "ward_number": 124,
    "name": "Nangli Sakrawati",
    "raw_name": "Nangli Sakrawati (W)",
    "ac_number": 34,
    "ac_name": "Matiala",
    "lok_sabha": "West Delhi",
    "district": "South West",
    "zone": "Najafgarh",
    "reservation": "WOMEN"
  },
  {
    "ward_number": 125,
    "name": "Chhawala",
    "raw_name": "Chhawala",
    "ac_number": 35,
    "ac_name": "Najafgarh",
    "lok_sabha": "West Delhi",
    "district": "South West",
    "zone": "Najafgarh",
    "reservation": "GEN"
  },
  {
    "ward_number": 126,
    "name": "Isapur",
    "raw_name": "Isapur (W)",
    "ac_number": 35,
    "ac_name": "Najafgarh",
    "lok_sabha": "West Delhi",
    "district": "South West",
    "zone": "Najafgarh",
    "reservation": "WOMEN"
  },
  {
    "ward_number": 127,
    "name": "Najafgarh",
    "raw_name": "Najafgarh",
    "ac_number": 35,
    "ac_name": "Najafgarh",
    "lok_sabha": "West Delhi",
    "district": "South West",
    "zone": "Najafgarh",
    "reservation": "GEN"
  },
  {
    "ward_number": 128,
    "name": "Dichaon Kalan",
    "raw_name": "Dichaon Kalan (W)",
    "ac_number": 35,
    "ac_name": "Najafgarh",
    "lok_sabha": "West Delhi",
    "district": "South West",
    "zone": "Najafgarh",
    "reservation": "WOMEN"
  },
  {
    "ward_number": 129,
    "name": "Roshan Pura",
    "raw_name": "Roshan Pura",
    "ac_number": 35,
    "ac_name": "Najafgarh",
    "lok_sabha": "West Delhi",
    "district": "South West",
    "zone": "Najafgarh",
    "reservation": "GEN"
  },
  {
    "ward_number": 130,
    "name": "Dwarka-C",
    "raw_name": "Dwarka-C (W)",
    "ac_number": 36,
    "ac_name": "Bijwasan",
    "lok_sabha": "South Delhi",
    "district": "South West",
    "zone": "Najafgarh",
    "reservation": "WOMEN"
  },
  {
    "ward_number": 131,
    "name": "Bijwasan",
    "raw_name": "Bijwasan",
    "ac_number": 36,
    "ac_name": "Bijwasan",
    "lok_sabha": "South Delhi",
    "district": "South West",
    "zone": "Najafgarh",
    "reservation": "GEN"
  },
  {
    "ward_number": 132,
    "name": "Kapashera",
    "raw_name": "Kapashera (W)",
    "ac_number": 36,
    "ac_name": "Bijwasan",
    "lok_sabha": "South Delhi",
    "district": "South West",
    "zone": "Najafgarh",
    "reservation": "WOMEN"
  },
  {
    "ward_number": 133,
    "name": "Mahipalpur",
    "raw_name": "Mahipalpur",
    "ac_number": 36,
    "ac_name": "Bijwasan",
    "lok_sabha": "South Delhi",
    "district": "South West",
    "zone": "Najafgarh",
    "reservation": "GEN"
  },
  {
    "ward_number": 134,
    "name": "Raj Nagar",
    "raw_name": "Raj Nagar (W)",
    "ac_number": 37,
    "ac_name": "Palam",
    "lok_sabha": "South Delhi",
    "district": "South West",
    "zone": "Najafgarh",
    "reservation": "WOMEN"
  },
  {
    "ward_number": 135,
    "name": "Palam",
    "raw_name": "Palam",
    "ac_number": 37,
    "ac_name": "Palam",
    "lok_sabha": "South Delhi",
    "district": "South West",
    "zone": "Najafgarh",
    "reservation": "GEN"
  },
  {
    "ward_number": 136,
    "name": "Madhu Vihar",
    "raw_name": "Madhu Vihar (W)",
    "ac_number": 37,
    "ac_name": "Palam",
    "lok_sabha": "South Delhi",
    "district": "South West",
    "zone": "Najafgarh",
    "reservation": "WOMEN"
  },
  {
    "ward_number": 137,
    "name": "Mahavir Enclave",
    "raw_name": "Mahavir Enclave",
    "ac_number": 37,
    "ac_name": "Palam",
    "lok_sabha": "South Delhi",
    "district": "South West",
    "zone": "Najafgarh",
    "reservation": "GEN"
  },
  {
    "ward_number": 138,
    "name": "Sadh Nagar",
    "raw_name": "Sadh Nagar (W)",
    "ac_number": 37,
    "ac_name": "Palam",
    "lok_sabha": "South Delhi",
    "district": "South West",
    "zone": "Najafgarh",
    "reservation": "WOMEN"
  },
  {
    "ward_number": 139,
    "name": "Naraina",
    "raw_name": "Naraina",
    "ac_number": 39,
    "ac_name": "Rajinder Nagar",
    "lok_sabha": "New Delhi",
    "district": "New Delhi",
    "zone": "Karol Bagh",
    "reservation": "GEN"
  },
  {
    "ward_number": 140,
    "name": "Inder Puri",
    "raw_name": "Inder Puri (SC)",
    "ac_number": 39,
    "ac_name": "Rajinder Nagar",
    "lok_sabha": "New Delhi",
    "district": "New Delhi",
    "zone": "Karol Bagh",
    "reservation": "SC"
  },
  {
    "ward_number": 141,
    "name": "Rajinder Nagar",
    "raw_name": "Rajinder Nagar (W)",
    "ac_number": 39,
    "ac_name": "Rajinder Nagar",
    "lok_sabha": "New Delhi",
    "district": "New Delhi",
    "zone": "Karol Bagh",
    "reservation": "WOMEN"
  },
  {
    "ward_number": 142,
    "name": "Daryaganj",
    "raw_name": "Daryaganj",
    "ac_number": 41,
    "ac_name": "Jangpura",
    "lok_sabha": "East Delhi",
    "district": "South East",
    "zone": "Central",
    "reservation": "GEN"
  },
  {
    "ward_number": 143,
    "name": "Sidhartha Nagar",
    "raw_name": "Sidhartha Nagar (W)",
    "ac_number": 41,
    "ac_name": "Jangpura",
    "lok_sabha": "East Delhi",
    "district": "South East",
    "zone": "Central",
    "reservation": "WOMEN"
  },
  {
    "ward_number": 144,
    "name": "Lajpat Nagar",
    "raw_name": "Lajpat Nagar",
    "ac_number": 41,
    "ac_name": "Jangpura",
    "lok_sabha": "East Delhi",
    "district": "South East",
    "zone": "Central",
    "reservation": "GEN"
  },
  {
    "ward_number": 145,
    "name": "Andrews Ganj",
    "raw_name": "Andrews Ganj (W)",
    "ac_number": 42,
    "ac_name": "Kasturba Nagar",
    "lok_sabha": "New Delhi",
    "district": "South",
    "zone": "Central",
    "reservation": "WOMEN"
  },
  {
    "ward_number": 146,
    "name": "Amar Colony",
    "raw_name": "Amar Colony",
    "ac_number": 42,
    "ac_name": "Kasturba Nagar",
    "lok_sabha": "New Delhi",
    "district": "South",
    "zone": "Central",
    "reservation": "GEN"
  },
  {
    "ward_number": 147,
    "name": "Kotla Mubarakpur",
    "raw_name": "Kotla Mubarakpur (W)",
    "ac_number": 42,
    "ac_name": "Kasturba Nagar",
    "lok_sabha": "New Delhi",
    "district": "South",
    "zone": "Central",
    "reservation": "WOMEN"
  },
  {
    "ward_number": 148,
    "name": "Hauz Khas",
    "raw_name": "Hauz Khas",
    "ac_number": 43,
    "ac_name": "Malviya Nagar",
    "lok_sabha": "New Delhi",
    "district": "South",
    "zone": "South",
    "reservation": "GEN"
  },
  {
    "ward_number": 149,
    "name": "Malviya Nagar",
    "raw_name": "Malviya Nagar (W)",
    "ac_number": 43,
    "ac_name": "Malviya Nagar",
    "lok_sabha": "New Delhi",
    "district": "South",
    "zone": "South",
    "reservation": "WOMEN"
  },
  {
    "ward_number": 150,
    "name": "Green Park",
    "raw_name": "Green Park",
    "ac_number": 43,
    "ac_name": "Malviya Nagar",
    "lok_sabha": "New Delhi",
    "district": "South",
    "zone": "South",
    "reservation": "GEN"
  },
  {
    "ward_number": 151,
    "name": "Munirka",
    "raw_name": "Munirka (W)",
    "ac_number": 44,
    "ac_name": "R.K. Puram",
    "lok_sabha": "New Delhi",
    "district": "New Delhi",
    "zone": "South",
    "reservation": "WOMEN"
  },
  {
    "ward_number": 152,
    "name": "R.K Puram",
    "raw_name": "R.K Puram",
    "ac_number": 44,
    "ac_name": "R.K. Puram",
    "lok_sabha": "New Delhi",
    "district": "New Delhi",
    "zone": "South",
    "reservation": "GEN"
  },
  {
    "ward_number": 153,
    "name": "Vasant Vihar",
    "raw_name": "Vasant Vihar (W)",
    "ac_number": 44,
    "ac_name": "R.K. Puram",
    "lok_sabha": "New Delhi",
    "district": "New Delhi",
    "zone": "South",
    "reservation": "WOMEN"
  },
  {
    "ward_number": 154,
    "name": "Lado Sarai",
    "raw_name": "Lado Sarai",
    "ac_number": 45,
    "ac_name": "Mehrauli",
    "lok_sabha": "South Delhi",
    "district": "South",
    "zone": "South",
    "reservation": "GEN"
  },
  {
    "ward_number": 155,
    "name": "Mehrauli",
    "raw_name": "Mehrauli (W)",
    "ac_number": 45,
    "ac_name": "Mehrauli",
    "lok_sabha": "South Delhi",
    "district": "South",
    "zone": "South",
    "reservation": "WOMEN"
  },
  {
    "ward_number": 156,
    "name": "Vasant Kunj",
    "raw_name": "Vasant Kunj",
    "ac_number": 45,
    "ac_name": "Mehrauli",
    "lok_sabha": "South Delhi",
    "district": "South",
    "zone": "South",
    "reservation": "GEN"
  },
  {
    "ward_number": 157,
    "name": "Aya Nagar",
    "raw_name": "Aya Nagar (W)",
    "ac_number": 46,
    "ac_name": "Chhatarpur",
    "lok_sabha": "South Delhi",
    "district": "South",
    "zone": "South",
    "reservation": "WOMEN"
  },
  {
    "ward_number": 158,
    "name": "Bhati",
    "raw_name": "Bhati",
    "ac_number": 46,
    "ac_name": "Chhatarpur",
    "lok_sabha": "South Delhi",
    "district": "South",
    "zone": "South",
    "reservation": "GEN"
  },
  {
    "ward_number": 159,
    "name": "Chhatarpur",
    "raw_name": "Chhatarpur (W)",
    "ac_number": 46,
    "ac_name": "Chhatarpur",
    "lok_sabha": "South Delhi",
    "district": "South",
    "zone": "South",
    "reservation": "WOMEN"
  },
  {
    "ward_number": 160,
    "name": "Said-Ul-Ajaib",
    "raw_name": "Said-Ul-Ajaib",
    "ac_number": 47,
    "ac_name": "Deoli",
    "lok_sabha": "South Delhi",
    "district": "South",
    "zone": "South",
    "reservation": "GEN"
  },
  {
    "ward_number": 161,
    "name": "Deoli",
    "raw_name": "Deoli (W)",
    "ac_number": 47,
    "ac_name": "Deoli",
    "lok_sabha": "South Delhi",
    "district": "South",
    "zone": "South",
    "reservation": "WOMEN"
  },
  {
    "ward_number": 162,
    "name": "Tigri",
    "raw_name": "Tigri (SC-W)",
    "ac_number": 47,
    "ac_name": "Deoli",
    "lok_sabha": "South Delhi",
    "district": "South",
    "zone": "South",
    "reservation": "SC_WOMEN"
  },
  {
    "ward_number": 163,
    "name": "Sangam Vihar-A",
    "raw_name": "Sangam Vihar-A",
    "ac_number": 47,
    "ac_name": "Deoli",
    "lok_sabha": "South Delhi",
    "district": "South",
    "zone": "South",
    "reservation": "GEN"
  },
  {
    "ward_number": 164,
    "name": "Dakshin Puri",
    "raw_name": "Dakshin Puri (SC)",
    "ac_number": 48,
    "ac_name": "Ambedkar Nagar",
    "lok_sabha": "South Delhi",
    "district": "South",
    "zone": "South",
    "reservation": "SC"
  },
  {
    "ward_number": 165,
    "name": "Madangir",
    "raw_name": "Madangir (SC-W)",
    "ac_number": 48,
    "ac_name": "Ambedkar Nagar",
    "lok_sabha": "South Delhi",
    "district": "South",
    "zone": "South",
    "reservation": "SC_WOMEN"
  },
  {
    "ward_number": 166,
    "name": "Pushp Vihar",
    "raw_name": "Pushp Vihar (SC)",
    "ac_number": 48,
    "ac_name": "Ambedkar Nagar",
    "lok_sabha": "South Delhi",
    "district": "South",
    "zone": "South",
    "reservation": "SC"
  },
  {
    "ward_number": 167,
    "name": "Khanpur",
    "raw_name": "Khanpur (W)",
    "ac_number": 49,
    "ac_name": "Sangam Vihar",
    "lok_sabha": "South Delhi",
    "district": "South",
    "zone": "South",
    "reservation": "WOMEN"
  },
  {
    "ward_number": 168,
    "name": "Sangam Vihar-C",
    "raw_name": "Sangam Vihar-C",
    "ac_number": 49,
    "ac_name": "Sangam Vihar",
    "lok_sabha": "South Delhi",
    "district": "South",
    "zone": "South",
    "reservation": "GEN"
  },
  {
    "ward_number": 169,
    "name": "Sangam Vihar-B",
    "raw_name": "Sangam Vihar-B (W)",
    "ac_number": 49,
    "ac_name": "Sangam Vihar",
    "lok_sabha": "South Delhi",
    "district": "South",
    "zone": "South",
    "reservation": "WOMEN"
  },
  {
    "ward_number": 170,
    "name": "Tughlakabad Extension",
    "raw_name": "Tughlakabad Extension",
    "ac_number": 50,
    "ac_name": "Greater Kailash",
    "lok_sabha": "New Delhi",
    "district": "South",
    "zone": "Central",
    "reservation": "GEN"
  },
  {
    "ward_number": 171,
    "name": "Chitaranjan Park",
    "raw_name": "Chitaranjan Park (W)",
    "ac_number": 50,
    "ac_name": "Greater Kailash",
    "lok_sabha": "New Delhi",
    "district": "South",
    "zone": "Central",
    "reservation": "WOMEN"
  },
  {
    "ward_number": 172,
    "name": "Chirag Delhi",
    "raw_name": "Chirag Delhi",
    "ac_number": 50,
    "ac_name": "Greater Kailash",
    "lok_sabha": "New Delhi",
    "district": "South",
    "zone": "Central",
    "reservation": "GEN"
  },
  {
    "ward_number": 173,
    "name": "Greater Kailash",
    "raw_name": "Greater Kailash (W)",
    "ac_number": 50,
    "ac_name": "Greater Kailash",
    "lok_sabha": "New Delhi",
    "district": "South",
    "zone": "Central",
    "reservation": "WOMEN"
  },
  {
    "ward_number": 174,
    "name": "Sri Niwas Puri",
    "raw_name": "Sri Niwas Puri",
    "ac_number": 51,
    "ac_name": "Kalkaji",
    "lok_sabha": "South Delhi",
    "district": "South East",
    "zone": "Central",
    "reservation": "GEN"
  },
  {
    "ward_number": 175,
    "name": "Kalkaji",
    "raw_name": "Kalkaji (W)",
    "ac_number": 51,
    "ac_name": "Kalkaji",
    "lok_sabha": "South Delhi",
    "district": "South East",
    "zone": "Central",
    "reservation": "WOMEN"
  },
  {
    "ward_number": 176,
    "name": "Govind Puri",
    "raw_name": "Govind Puri",
    "ac_number": 51,
    "ac_name": "Kalkaji",
    "lok_sabha": "South Delhi",
    "district": "South East",
    "zone": "Central",
    "reservation": "GEN"
  },
  {
    "ward_number": 177,
    "name": "Harkesh Nagar",
    "raw_name": "Harkesh Nagar (SC-W)",
    "ac_number": 52,
    "ac_name": "Tughlakabad",
    "lok_sabha": "South Delhi",
    "district": "South East",
    "zone": "Central",
    "reservation": "SC_WOMEN"
  },
  {
    "ward_number": 178,
    "name": "Tughlakabad",
    "raw_name": "Tughlakabad (W)",
    "ac_number": 52,
    "ac_name": "Tughlakabad",
    "lok_sabha": "South Delhi",
    "district": "South East",
    "zone": "Central",
    "reservation": "WOMEN"
  },
  {
    "ward_number": 179,
    "name": "Pul Pehladpur",
    "raw_name": "Pul Pehladpur (SC)",
    "ac_number": 53,
    "ac_name": "Badarpur",
    "lok_sabha": "South Delhi",
    "district": "South East",
    "zone": "Central",
    "reservation": "SC"
  },
  {
    "ward_number": 180,
    "name": "Badarpur",
    "raw_name": "Badarpur (SC-W)",
    "ac_number": 53,
    "ac_name": "Badarpur",
    "lok_sabha": "South Delhi",
    "district": "South East",
    "zone": "Central",
    "reservation": "SC_WOMEN"
  },
  {
    "ward_number": 181,
    "name": "Molarband",
    "raw_name": "Molarband",
    "ac_number": 53,
    "ac_name": "Badarpur",
    "lok_sabha": "South Delhi",
    "district": "South East",
    "zone": "Central",
    "reservation": "GEN"
  },
  {
    "ward_number": 182,
    "name": "Meethapur",
    "raw_name": "Meethapur (W)",
    "ac_number": 53,
    "ac_name": "Badarpur",
    "lok_sabha": "South Delhi",
    "district": "South East",
    "zone": "Central",
    "reservation": "WOMEN"
  },
  {
    "ward_number": 183,
    "name": "Hari Nagar Extension",
    "raw_name": "Hari Nagar Extension",
    "ac_number": 53,
    "ac_name": "Badarpur",
    "lok_sabha": "South Delhi",
    "district": "South East",
    "zone": "Central",
    "reservation": "GEN"
  },
  {
    "ward_number": 184,
    "name": "Jaitpur",
    "raw_name": "Jaitpur (W)",
    "ac_number": 54,
    "ac_name": "Okhla",
    "lok_sabha": "East Delhi",
    "district": "South East",
    "zone": "Central",
    "reservation": "WOMEN"
  },
  {
    "ward_number": 185,
    "name": "Madanpur Khadar East",
    "raw_name": "Madanpur Khadar East (SC)",
    "ac_number": 54,
    "ac_name": "Okhla",
    "lok_sabha": "East Delhi",
    "district": "South East",
    "zone": "Central",
    "reservation": "SC"
  },
  {
    "ward_number": 186,
    "name": "Madanpur Khadar West",
    "raw_name": "Madanpur Khadar West",
    "ac_number": 54,
    "ac_name": "Okhla",
    "lok_sabha": "East Delhi",
    "district": "South East",
    "zone": "Central",
    "reservation": "GEN"
  },
  {
    "ward_number": 187,
    "name": "Sarita Vihar",
    "raw_name": "Sarita Vihar (W)",
    "ac_number": 54,
    "ac_name": "Okhla",
    "lok_sabha": "East Delhi",
    "district": "South East",
    "zone": "Central",
    "reservation": "WOMEN"
  },
  {
    "ward_number": 188,
    "name": "Abul Fazal Enclave",
    "raw_name": "Abul Fazal Enclave",
    "ac_number": 54,
    "ac_name": "Okhla",
    "lok_sabha": "East Delhi",
    "district": "South East",
    "zone": "Central",
    "reservation": "GEN"
  },
  {
    "ward_number": 189,
    "name": "Zakir Nagar",
    "raw_name": "Zakir Nagar (W)",
    "ac_number": 54,
    "ac_name": "Okhla",
    "lok_sabha": "East Delhi",
    "district": "South East",
    "zone": "Central",
    "reservation": "WOMEN"
  },
  {
    "ward_number": 190,
    "name": "New Ashok Nagar",
    "raw_name": "New Ashok Nagar",
    "ac_number": 55,
    "ac_name": "Trilokpuri",
    "lok_sabha": "East Delhi",
    "district": "East",
    "zone": "Shahdara South",
    "reservation": "GEN"
  },
  {
    "ward_number": 191,
    "name": "Mayur Vihar Phase-I",
    "raw_name": "Mayur Vihar Phase-I (SC-W)",
    "ac_number": 55,
    "ac_name": "Trilokpuri",
    "lok_sabha": "East Delhi",
    "district": "East",
    "zone": "Shahdara South",
    "reservation": "SC_WOMEN"
  },
  {
    "ward_number": 192,
    "name": "Trilokpuri",
    "raw_name": "Trilokpuri (SC)",
    "ac_number": 55,
    "ac_name": "Trilokpuri",
    "lok_sabha": "East Delhi",
    "district": "East",
    "zone": "Shahdara South",
    "reservation": "SC"
  },
  {
    "ward_number": 193,
    "name": "Kondli",
    "raw_name": "Kondli (W)",
    "ac_number": 56,
    "ac_name": "Kondli",
    "lok_sabha": "East Delhi",
    "district": "East",
    "zone": "Shahdara South",
    "reservation": "WOMEN"
  },
  {
    "ward_number": 194,
    "name": "Gharoli",
    "raw_name": "Gharoli (SC-W)",
    "ac_number": 56,
    "ac_name": "Kondli",
    "lok_sabha": "East Delhi",
    "district": "East",
    "zone": "Shahdara South",
    "reservation": "SC_WOMEN"
  },
  {
    "ward_number": 195,
    "name": "Kalyanpuri",
    "raw_name": "Kalyanpuri (SC)",
    "ac_number": 56,
    "ac_name": "Kondli",
    "lok_sabha": "East Delhi",
    "district": "East",
    "zone": "Shahdara South",
    "reservation": "SC"
  },
  {
    "ward_number": 196,
    "name": "Mayur Vihar Phase-II",
    "raw_name": "Mayur Vihar Phase-II",
    "ac_number": 57,
    "ac_name": "Patparganj",
    "lok_sabha": "East Delhi",
    "district": "East",
    "zone": "Shahdara South",
    "reservation": "GEN"
  },
  {
    "ward_number": 197,
    "name": "Patpar Ganj",
    "raw_name": "Patpar Ganj (SC)",
    "ac_number": 57,
    "ac_name": "Patparganj",
    "lok_sabha": "East Delhi",
    "district": "East",
    "zone": "Shahdara South",
    "reservation": "SC"
  },
  {
    "ward_number": 198,
    "name": "Vinod Nagar",
    "raw_name": "Vinod Nagar",
    "ac_number": 57,
    "ac_name": "Patparganj",
    "lok_sabha": "East Delhi",
    "district": "East",
    "zone": "Shahdara South",
    "reservation": "GEN"
  },
  {
    "ward_number": 199,
    "name": "Mandawali",
    "raw_name": "Mandawali (SC)",
    "ac_number": 57,
    "ac_name": "Patparganj",
    "lok_sabha": "East Delhi",
    "district": "East",
    "zone": "Shahdara South",
    "reservation": "SC"
  },
  {
    "ward_number": 200,
    "name": "Pandav Nagar",
    "raw_name": "Pandav Nagar",
    "ac_number": 58,
    "ac_name": "Laxmi Nagar",
    "lok_sabha": "East Delhi",
    "district": "East",
    "zone": "Shahdara South",
    "reservation": "GEN"
  },
  {
    "ward_number": 201,
    "name": "Lalita Park",
    "raw_name": "Lalita Park (W)",
    "ac_number": 58,
    "ac_name": "Laxmi Nagar",
    "lok_sabha": "East Delhi",
    "district": "East",
    "zone": "Shahdara South",
    "reservation": "WOMEN"
  },
  {
    "ward_number": 202,
    "name": "Shakarpur",
    "raw_name": "Shakarpur",
    "ac_number": 58,
    "ac_name": "Laxmi Nagar",
    "lok_sabha": "East Delhi",
    "district": "East",
    "zone": "Shahdara South",
    "reservation": "GEN"
  },
  {
    "ward_number": 203,
    "name": "Laxmi Nagar",
    "raw_name": "Laxmi Nagar (SC)",
    "ac_number": 58,
    "ac_name": "Laxmi Nagar",
    "lok_sabha": "East Delhi",
    "district": "East",
    "zone": "Shahdara South",
    "reservation": "SC"
  },
  {
    "ward_number": 204,
    "name": "Preet Vihar",
    "raw_name": "Preet Vihar",
    "ac_number": 59,
    "ac_name": "Vishwas Nagar",
    "lok_sabha": "East Delhi",
    "district": "Shahdara",
    "zone": "Shahdara South",
    "reservation": "GEN"
  },
  {
    "ward_number": 205,
    "name": "I.P Extension",
    "raw_name": "I.P Extension (SC)",
    "ac_number": 59,
    "ac_name": "Vishwas Nagar",
    "lok_sabha": "East Delhi",
    "district": "Shahdara",
    "zone": "Shahdara South",
    "reservation": "SC"
  },
  {
    "ward_number": 206,
    "name": "Anand Vihar",
    "raw_name": "Anand Vihar",
    "ac_number": 59,
    "ac_name": "Vishwas Nagar",
    "lok_sabha": "East Delhi",
    "district": "Shahdara",
    "zone": "Shahdara South",
    "reservation": "GEN"
  },
  {
    "ward_number": 207,
    "name": "Vishwas Nagar",
    "raw_name": "Vishwas Nagar (SC-W)",
    "ac_number": 59,
    "ac_name": "Vishwas Nagar",
    "lok_sabha": "East Delhi",
    "district": "Shahdara",
    "zone": "Shahdara South",
    "reservation": "SC_WOMEN"
  },
  {
    "ward_number": 208,
    "name": "Anarkali",
    "raw_name": "Anarkali (W)",
    "ac_number": 60,
    "ac_name": "Krishna Nagar",
    "lok_sabha": "East Delhi",
    "district": "East",
    "zone": "Shahdara South",
    "reservation": "WOMEN"
  },
  {
    "ward_number": 209,
    "name": "Jagat Puri",
    "raw_name": "Jagat Puri",
    "ac_number": 60,
    "ac_name": "Krishna Nagar",
    "lok_sabha": "East Delhi",
    "district": "East",
    "zone": "Shahdara South",
    "reservation": "GEN"
  },
  {
    "ward_number": 210,
    "name": "Geeta Colony",
    "raw_name": "Geeta Colony (W)",
    "ac_number": 60,
    "ac_name": "Krishna Nagar",
    "lok_sabha": "East Delhi",
    "district": "East",
    "zone": "Shahdara South",
    "reservation": "WOMEN"
  },
  {
    "ward_number": 211,
    "name": "Krishna Nagar",
    "raw_name": "Krishna Nagar",
    "ac_number": 60,
    "ac_name": "Krishna Nagar",
    "lok_sabha": "East Delhi",
    "district": "East",
    "zone": "Shahdara South",
    "reservation": "GEN"
  },
  {
    "ward_number": 212,
    "name": "Gandhi Nagar",
    "raw_name": "Gandhi Nagar (W)",
    "ac_number": 61,
    "ac_name": "Gandhi Nagar",
    "lok_sabha": "East Delhi",
    "district": "East",
    "zone": "Shahdara South",
    "reservation": "WOMEN"
  },
  {
    "ward_number": 213,
    "name": "Shastri Park",
    "raw_name": "Shastri Park",
    "ac_number": 61,
    "ac_name": "Gandhi Nagar",
    "lok_sabha": "East Delhi",
    "district": "East",
    "zone": "Shahdara South",
    "reservation": "GEN"
  },
  {
    "ward_number": 214,
    "name": "Azad Nagar",
    "raw_name": "Azad Nagar (W)",
    "ac_number": 61,
    "ac_name": "Gandhi Nagar",
    "lok_sabha": "East Delhi",
    "district": "East",
    "zone": "Shahdara South",
    "reservation": "WOMEN"
  },
  {
    "ward_number": 215,
    "name": "Shahdara",
    "raw_name": "Shahdara (SC)",
    "ac_number": 62,
    "ac_name": "Shahdara",
    "lok_sabha": "East Delhi",
    "district": "Shahdara",
    "zone": "Shahdara North",
    "reservation": "SC"
  },
  {
    "ward_number": 216,
    "name": "Jhilmil",
    "raw_name": "Jhilmil",
    "ac_number": 62,
    "ac_name": "Shahdara",
    "lok_sabha": "East Delhi",
    "district": "Shahdara",
    "zone": "Shahdara North",
    "reservation": "GEN"
  },
  {
    "ward_number": 217,
    "name": "Dilshad Colony",
    "raw_name": "Dilshad Colony (W)",
    "ac_number": 62,
    "ac_name": "Shahdara",
    "lok_sabha": "East Delhi",
    "district": "Shahdara",
    "zone": "Shahdara North",
    "reservation": "WOMEN"
  },
  {
    "ward_number": 218,
    "name": "Sundar Nagri",
    "raw_name": "Sundar Nagri (SC-W)",
    "ac_number": 63,
    "ac_name": "Seemapuri",
    "lok_sabha": "North East Delhi",
    "district": "Shahdara",
    "zone": "Shahdara North",
    "reservation": "SC_WOMEN"
  },
  {
    "ward_number": 219,
    "name": "Dilshad Garden",
    "raw_name": "Dilshad Garden",
    "ac_number": 63,
    "ac_name": "Seemapuri",
    "lok_sabha": "North East Delhi",
    "district": "Shahdara",
    "zone": "Shahdara North",
    "reservation": "GEN"
  },
  {
    "ward_number": 220,
    "name": "Nand Nagri",
    "raw_name": "Nand Nagri (SC)",
    "ac_number": 63,
    "ac_name": "Seemapuri",
    "lok_sabha": "North East Delhi",
    "district": "Shahdara",
    "zone": "Shahdara North",
    "reservation": "SC"
  },
  {
    "ward_number": 221,
    "name": "Ashok Nagar",
    "raw_name": "Ashok Nagar (W)",
    "ac_number": 63,
    "ac_name": "Seemapuri",
    "lok_sabha": "North East Delhi",
    "district": "Shahdara",
    "zone": "Shahdara North",
    "reservation": "WOMEN"
  },
  {
    "ward_number": 222,
    "name": "Ram Nagar East",
    "raw_name": "Ram Nagar East",
    "ac_number": 64,
    "ac_name": "Rohtas Nagar",
    "lok_sabha": "North East Delhi",
    "district": "Shahdara",
    "zone": "Shahdara North",
    "reservation": "GEN"
  },
  {
    "ward_number": 223,
    "name": "Rohtash Nagar",
    "raw_name": "Rohtash Nagar (W)",
    "ac_number": 64,
    "ac_name": "Rohtas Nagar",
    "lok_sabha": "North East Delhi",
    "district": "Shahdara",
    "zone": "Shahdara North",
    "reservation": "WOMEN"
  },
  {
    "ward_number": 224,
    "name": "Welcome Colony",
    "raw_name": "Welcome Colony",
    "ac_number": 64,
    "ac_name": "Rohtas Nagar",
    "lok_sabha": "North East Delhi",
    "district": "Shahdara",
    "zone": "Shahdara North",
    "reservation": "GEN"
  },
  {
    "ward_number": 225,
    "name": "Seelampur",
    "raw_name": "Seelampur (W)",
    "ac_number": 65,
    "ac_name": "Seelampur",
    "lok_sabha": "North East Delhi",
    "district": "North East",
    "zone": "Shahdara North",
    "reservation": "WOMEN"
  },
  {
    "ward_number": 226,
    "name": "Gautam Puri",
    "raw_name": "Gautam Puri",
    "ac_number": 65,
    "ac_name": "Seelampur",
    "lok_sabha": "North East Delhi",
    "district": "North East",
    "zone": "Shahdara North",
    "reservation": "GEN"
  },
  {
    "ward_number": 227,
    "name": "Chauhan Banger",
    "raw_name": "Chauhan Banger (W)",
    "ac_number": 65,
    "ac_name": "Seelampur",
    "lok_sabha": "North East Delhi",
    "district": "North East",
    "zone": "Shahdara North",
    "reservation": "WOMEN"
  },
  {
    "ward_number": 228,
    "name": "Maujpur",
    "raw_name": "Maujpur",
    "ac_number": 65,
    "ac_name": "Seelampur",
    "lok_sabha": "North East Delhi",
    "district": "North East",
    "zone": "Shahdara North",
    "reservation": "GEN"
  },
  {
    "ward_number": 229,
    "name": "Braham Puri",
    "raw_name": "Braham Puri (W)",
    "ac_number": 66,
    "ac_name": "Ghonda",
    "lok_sabha": "North East Delhi",
    "district": "North East",
    "zone": "Shahdara North",
    "reservation": "WOMEN"
  },
  {
    "ward_number": 230,
    "name": "Bhajanpura",
    "raw_name": "Bhajanpura",
    "ac_number": 66,
    "ac_name": "Ghonda",
    "lok_sabha": "North East Delhi",
    "district": "North East",
    "zone": "Shahdara North",
    "reservation": "GEN"
  },
  {
    "ward_number": 231,
    "name": "Ghonda",
    "raw_name": "Ghonda (W)",
    "ac_number": 66,
    "ac_name": "Ghonda",
    "lok_sabha": "North East Delhi",
    "district": "North East",
    "zone": "Shahdara North",
    "reservation": "WOMEN"
  },
  {
    "ward_number": 232,
    "name": "Yamuna Vihar",
    "raw_name": "Yamuna Vihar",
    "ac_number": 66,
    "ac_name": "Ghonda",
    "lok_sabha": "North East Delhi",
    "district": "North East",
    "zone": "Shahdara North",
    "reservation": "GEN"
  },
  {
    "ward_number": 233,
    "name": "Subash Mohalla",
    "raw_name": "Subash Mohalla (W)",
    "ac_number": 67,
    "ac_name": "Babarpur",
    "lok_sabha": "North East Delhi",
    "district": "Shahdara",
    "zone": "Shahdara North",
    "reservation": "WOMEN"
  },
  {
    "ward_number": 234,
    "name": "Kabir Nagar",
    "raw_name": "Kabir Nagar",
    "ac_number": 67,
    "ac_name": "Babarpur",
    "lok_sabha": "North East Delhi",
    "district": "Shahdara",
    "zone": "Shahdara North",
    "reservation": "GEN"
  },
  {
    "ward_number": 235,
    "name": "Gorakh Park",
    "raw_name": "Gorakh Park (W)",
    "ac_number": 67,
    "ac_name": "Babarpur",
    "lok_sabha": "North East Delhi",
    "district": "Shahdara",
    "zone": "Shahdara North",
    "reservation": "WOMEN"
  },
  {
    "ward_number": 236,
    "name": "Kardam Puri",
    "raw_name": "Kardam Puri",
    "ac_number": 67,
    "ac_name": "Babarpur",
    "lok_sabha": "North East Delhi",
    "district": "Shahdara",
    "zone": "Shahdara North",
    "reservation": "GEN"
  },
  {
    "ward_number": 237,
    "name": "Harsh Vihar",
    "raw_name": "Harsh Vihar (SC-W)",
    "ac_number": 68,
    "ac_name": "Gokalpur",
    "lok_sabha": "North East Delhi",
    "district": "North East",
    "zone": "Shahdara North",
    "reservation": "SC_WOMEN"
  },
  {
    "ward_number": 238,
    "name": "Saboli",
    "raw_name": "Saboli (SC)",
    "ac_number": 68,
    "ac_name": "Gokalpur",
    "lok_sabha": "North East Delhi",
    "district": "North East",
    "zone": "Shahdara North",
    "reservation": "SC"
  },
  {
    "ward_number": 239,
    "name": "Gokal Puri",
    "raw_name": "Gokal Puri (SC-W)",
    "ac_number": 68,
    "ac_name": "Gokalpur",
    "lok_sabha": "North East Delhi",
    "district": "North East",
    "zone": "Shahdara North",
    "reservation": "SC_WOMEN"
  },
  {
    "ward_number": 240,
    "name": "Joharipur",
    "raw_name": "Joharipur (SC)",
    "ac_number": 68,
    "ac_name": "Gokalpur",
    "lok_sabha": "North East Delhi",
    "district": "North East",
    "zone": "Shahdara North",
    "reservation": "SC"
  },
  {
    "ward_number": 241,
    "name": "Karawal Nagar-East",
    "raw_name": "Karawal Nagar-East (W)",
    "ac_number": 69,
    "ac_name": "Mustafabad",
    "lok_sabha": "North East Delhi",
    "district": "North East",
    "zone": "Shahdara North",
    "reservation": "WOMEN"
  },
  {
    "ward_number": 242,
    "name": "Dayalpur",
    "raw_name": "Dayalpur",
    "ac_number": 69,
    "ac_name": "Mustafabad",
    "lok_sabha": "North East Delhi",
    "district": "North East",
    "zone": "Shahdara North",
    "reservation": "GEN"
  },
  {
    "ward_number": 243,
    "name": "Mustafabad",
    "raw_name": "Mustafabad (W)",
    "ac_number": 69,
    "ac_name": "Mustafabad",
    "lok_sabha": "North East Delhi",
    "district": "North East",
    "zone": "Shahdara North",
    "reservation": "WOMEN"
  },
  {
    "ward_number": 244,
    "name": "Nehru Vihar",
    "raw_name": "Nehru Vihar",
    "ac_number": 69,
    "ac_name": "Mustafabad",
    "lok_sabha": "North East Delhi",
    "district": "North East",
    "zone": "Shahdara North",
    "reservation": "GEN"
  },
  {
    "ward_number": 245,
    "name": "Brij Puri",
    "raw_name": "Brij Puri (W)",
    "ac_number": 69,
    "ac_name": "Mustafabad",
    "lok_sabha": "North East Delhi",
    "district": "North East",
    "zone": "Shahdara North",
    "reservation": "WOMEN"
  },
  {
    "ward_number": 246,
    "name": "Sri Ram Colony",
    "raw_name": "Sri Ram Colony",
    "ac_number": 70,
    "ac_name": "Karawal Nagar",
    "lok_sabha": "North East Delhi",
    "district": "North East",
    "zone": "Shahdara North",
    "reservation": "GEN"
  },
  {
    "ward_number": 247,
    "name": "Sadatpur",
    "raw_name": "Sadatpur (W)",
    "ac_number": 70,
    "ac_name": "Karawal Nagar",
    "lok_sabha": "North East Delhi",
    "district": "North East",
    "zone": "Shahdara North",
    "reservation": "WOMEN"
  },
  {
    "ward_number": 248,
    "name": "Karawal Nagar-West",
    "raw_name": "Karawal Nagar-West",
    "ac_number": 70,
    "ac_name": "Karawal Nagar",
    "lok_sabha": "North East Delhi",
    "district": "North East",
    "zone": "Shahdara North",
    "reservation": "GEN"
  },
  {
    "ward_number": 249,
    "name": "Sonia Vihar",
    "raw_name": "Sonia Vihar (W)",
    "ac_number": 70,
    "ac_name": "Karawal Nagar",
    "lok_sabha": "North East Delhi",
    "district": "North East",
    "zone": "Shahdara North",
    "reservation": "WOMEN"
  },
  {
    "ward_number": 250,
    "name": "Sabapur",
    "raw_name": "Sabapur",
    "ac_number": 70,
    "ac_name": "Karawal Nagar",
    "lok_sabha": "North East Delhi",
    "district": "North East",
    "zone": "Shahdara North",
    "reservation": "GEN"
  }
];

/**
 * Standard Parliamentary (Lok Sabha) to Assembly (Vidhan Sabha) mapping
 */
export const lokSabhaToVidhanSabha: Record<string, string[]> = {
  "North West Delhi": [
    "Narela",
    "Badli",
    "Rithala",
    "Bawana",
    "Mundka",
    "Kirari",
    "Sultan Pur Majra",
    "Nangloi Jat",
    "Mangol Puri",
    "Rohini"
  ],
  "North East Delhi": [
    "Burari",
    "Timarpur",
    "Seemapuri",
    "Rohtas Nagar",
    "Seelampur",
    "Ghonda",
    "Babarpur",
    "Gokalpur",
    "Mustafabad",
    "Karawal Nagar"
  ],
  "Chandni Chowk": [
    "Adarsh Nagar",
    "Shalimar Bagh",
    "Shakur Basti",
    "Tri Nagar",
    "Wazirpur",
    "Model Town",
    "Sadar Bazar",
    "Chandni Chowk",
    "Matia Mahal",
    "Ballimaran"
  ],
  "New Delhi": [
    "Karol Bagh",
    "Patel Nagar",
    "Moti Nagar",
    "Delhi Cantonment",
    "Rajinder Nagar",
    "New Delhi",
    "Kasturba Nagar",
    "Malviya Nagar",
    "R.K. Puram",
    "Greater Kailash"
  ],
  "West Delhi": [
    "Madipur",
    "Rajouri Garden",
    "Hari Nagar",
    "Tilak Nagar",
    "Janakpuri",
    "Vikas Puri",
    "Uttam Nagar",
    "Dwarka",
    "Matiala",
    "Najafgarh"
  ],
  "South Delhi": [
    "Bijwasan",
    "Palam",
    "Mehrauli",
    "Chhatarpur",
    "Deoli",
    "Ambedkar Nagar",
    "Sangam Vihar",
    "Kalkaji",
    "Tughlakabad",
    "Badarpur"
  ],
  "East Delhi": [
    "Jangpura",
    "Okhla",
    "Trilokpuri",
    "Kondli",
    "Patparganj",
    "Laxmi Nagar",
    "Vishwas Nagar",
    "Krishna Nagar",
    "Gandhi Nagar",
    "Shahdara"
  ]
};

/**
 * Assembly Constituency to Ward list mapping (with official reservation labels)
 */
export const delhiConstituenciesAndWards: Record<string, string[]> = {
  "Narela": [
    "Narela (W)",
    "Bankner",
    "Holambi Kalan (W)",
    "Alipur",
    "Bakhtawarpur (W)"
  ],
  "Burari": [
    "Burari",
    "Kadipur (W)",
    "Mukundpur",
    "Sant Nagar (W)",
    "Jharoda"
  ],
  "Timarpur": [
    "Timarpur (W)",
    "Malka Ganj (SC-W)",
    "Mukherjee Nagar"
  ],
  "Adarsh Nagar": [
    "Dhirpur (W)",
    "Adarsh Nagar",
    "Azadpur (W)"
  ],
  "Badli": [
    "Bhalswa",
    "Jahangir Puri (W)",
    "Sarup Nagar",
    "Samaypur Badli (W)"
  ],
  "Rithala": [
    "Rohini-A",
    "Rohini-B (W)",
    "Rithala",
    "Vijay Vihar (W)",
    "Budh Vihar"
  ],
  "Bawana": [
    "Pooth Kalan (W)",
    "Begumpur",
    "Shahbaad Dairy (SC)",
    "Pooth Khurd (W)",
    "Bawana",
    "Nangal Thakran (W)"
  ],
  "Mundka": [
    "Kanjhawala",
    "Rani Khera (W)",
    "Nangloi (SC-W)",
    "Mundka",
    "Nilothi (W)"
  ],
  "Kirari": [
    "Kirari",
    "Prem Nagar (W)",
    "Mubarikpur",
    "Nithari (W)",
    "Aman Vihar"
  ],
  "Sultan Pur Majra": [
    "Mangol Puri (SC)",
    "Sultanpuri-A (SC-W)",
    "Sultanpuri-B (SC)"
  ],
  "Nangloi Jat": [
    "Jawalapuri (SC-W)",
    "Nangloi Jat (W)",
    "Nihal Vihar",
    "Guru Harkishan Nagar (W)"
  ],
  "Mangol Puri": [
    "Mangolpuri-A (SC)",
    "Mangolpuri-B (SC-W)",
    "Rohini-C"
  ],
  "Rohini": [
    "Rohini-F (W)",
    "Rohini-E",
    "Rohini-D (W)"
  ],
  "Shalimar Bagh": [
    "Shalimar Bagh-A",
    "Shalimar Bagh-B (W)",
    "Pitam Pura"
  ],
  "Shakur Basti": [
    "Saraswati Vihar (W)",
    "Paschim Vihar",
    "Rani Bagh (W)",
    "Kohat Enclave"
  ],
  "Tri Nagar": [
    "Shakur Pur (SC)",
    "Tri Nagar (W)",
    "Keshav Puram"
  ],
  "Wazirpur": [
    "Ashok Vihar (W)",
    "Wazir Pur (SC-W)"
  ],
  "Model Town": [
    "Sangam Park (SC)",
    "Model Town",
    "Kamla Nagar (W)"
  ],
  "Sadar Bazar": [
    "Shastri Nagar",
    "Kishan Ganj (SC-W)",
    "Sadar Bazar (W)",
    "Civil Lines (SC)"
  ],
  "Chandni Chowk": [
    "Chandni Chowk",
    "Jama Masjid (W)",
    "Chandani Mahal"
  ],
  "Matia Mahal": [
    "Delhi Gate (SC-W)",
    "Bazar Sita Ram (W)"
  ],
  "Ballimaran": [
    "Ballimaran",
    "Ram Nagar (SC)",
    "Quraish Nagar (W)"
  ],
  "Karol Bagh": [
    "Pahar Ganj",
    "Karol Bagh (SC-W)",
    "Dev Nagar (SC)"
  ],
  "Patel Nagar": [
    "West Patel Nagar (SC-W)",
    "East Patel Nagar (W)",
    "Ranjeet Nagar",
    "Baljeet Nagar (W)"
  ],
  "Moti Nagar": [
    "Karam Pura",
    "Moti Nagar (W)",
    "Ramesh Nagar",
    "Punjabi Bagh (W)"
  ],
  "Madipur": [
    "Madipur (SC)",
    "Raghubir Nagar (SC-W)",
    "Vishnu Garden"
  ],
  "Rajouri Garden": [
    "Rajouri Garden (W)",
    "Chaukhandi Nagar",
    "Subhash Nagar (W)"
  ],
  "Hari Nagar": [
    "Hari Nagar",
    "Fateh Nagar (W)",
    "Tilak Nagar",
    "Khyala (W)"
  ],
  "Tilak Nagar": [
    "Keshopur",
    "Janak Puri South (W)",
    "Mahaveer Enclave"
  ],
  "Janakpuri": [
    "Janak Puri West (W)",
    "Vikas Puri",
    "Hastsal (W)"
  ],
  "Vikas Puri": [
    "Shiv Vihar",
    "Bhakkar Wala (W)",
    "Baprola",
    "Vikas Nagar (W)",
    "Mohan Garden-West",
    "Mohan Garden-East (W)"
  ],
  "Uttam Nagar": [
    "Uttam Nagar",
    "Binda Pur (W)",
    "Dabri"
  ],
  "Dwarka": [
    "Sagarpur (W)",
    "Manglapuri",
    "Dwarka-B (W)"
  ],
  "Matiala": [
    "Dwarka-A",
    "Matiala (W)",
    "Kakrola",
    "Nangli Sakrawati (W)"
  ],
  "Najafgarh": [
    "Chhawala",
    "Isapur (W)",
    "Najafgarh",
    "Dichaon Kalan (W)",
    "Roshan Pura"
  ],
  "Bijwasan": [
    "Dwarka-C (W)",
    "Bijwasan",
    "Kapashera (W)",
    "Mahipalpur"
  ],
  "Palam": [
    "Raj Nagar (W)",
    "Palam",
    "Madhu Vihar (W)",
    "Mahavir Enclave",
    "Sadh Nagar (W)"
  ],
  "Delhi Cantonment": [],
  "Rajinder Nagar": [
    "Naraina",
    "Inder Puri (SC)",
    "Rajinder Nagar (W)"
  ],
  "New Delhi": [],
  "Jangpura": [
    "Daryaganj",
    "Sidhartha Nagar (W)",
    "Lajpat Nagar"
  ],
  "Kasturba Nagar": [
    "Andrews Ganj (W)",
    "Amar Colony",
    "Kotla Mubarakpur (W)"
  ],
  "Malviya Nagar": [
    "Hauz Khas",
    "Malviya Nagar (W)",
    "Green Park"
  ],
  "R.K. Puram": [
    "Munirka (W)",
    "R.K Puram",
    "Vasant Vihar (W)"
  ],
  "Mehrauli": [
    "Lado Sarai",
    "Mehrauli (W)",
    "Vasant Kunj"
  ],
  "Chhatarpur": [
    "Aya Nagar (W)",
    "Bhati",
    "Chhatarpur (W)"
  ],
  "Deoli": [
    "Said-Ul-Ajaib",
    "Deoli (W)",
    "Tigri (SC-W)",
    "Sangam Vihar-A"
  ],
  "Ambedkar Nagar": [
    "Dakshin Puri (SC)",
    "Madangir (SC-W)",
    "Pushp Vihar (SC)"
  ],
  "Sangam Vihar": [
    "Khanpur (W)",
    "Sangam Vihar-C",
    "Sangam Vihar-B (W)"
  ],
  "Greater Kailash": [
    "Tughlakabad Extension",
    "Chitaranjan Park (W)",
    "Chirag Delhi",
    "Greater Kailash (W)"
  ],
  "Kalkaji": [
    "Sri Niwas Puri",
    "Kalkaji (W)",
    "Govind Puri"
  ],
  "Tughlakabad": [
    "Harkesh Nagar (SC-W)",
    "Tughlakabad (W)"
  ],
  "Badarpur": [
    "Pul Pehladpur (SC)",
    "Badarpur (SC-W)",
    "Molarband",
    "Meethapur (W)",
    "Hari Nagar Extension"
  ],
  "Okhla": [
    "Jaitpur (W)",
    "Madanpur Khadar East (SC)",
    "Madanpur Khadar West",
    "Sarita Vihar (W)",
    "Abul Fazal Enclave",
    "Zakir Nagar (W)"
  ],
  "Trilokpuri": [
    "New Ashok Nagar",
    "Mayur Vihar Phase-I (SC-W)",
    "Trilokpuri (SC)"
  ],
  "Kondli": [
    "Kondli (W)",
    "Gharoli (SC-W)",
    "Kalyanpuri (SC)"
  ],
  "Patparganj": [
    "Mayur Vihar Phase-II",
    "Patpar Ganj (SC)",
    "Vinod Nagar",
    "Mandawali (SC)"
  ],
  "Laxmi Nagar": [
    "Pandav Nagar",
    "Lalita Park (W)",
    "Shakarpur",
    "Laxmi Nagar (SC)"
  ],
  "Vishwas Nagar": [
    "Preet Vihar",
    "I.P Extension (SC)",
    "Anand Vihar",
    "Vishwas Nagar (SC-W)"
  ],
  "Krishna Nagar": [
    "Anarkali (W)",
    "Jagat Puri",
    "Geeta Colony (W)",
    "Krishna Nagar"
  ],
  "Gandhi Nagar": [
    "Gandhi Nagar (W)",
    "Shastri Park",
    "Azad Nagar (W)"
  ],
  "Shahdara": [
    "Shahdara (SC)",
    "Jhilmil",
    "Dilshad Colony (W)"
  ],
  "Seemapuri": [
    "Sundar Nagri (SC-W)",
    "Dilshad Garden",
    "Nand Nagri (SC)",
    "Ashok Nagar (W)"
  ],
  "Rohtas Nagar": [
    "Ram Nagar East",
    "Rohtash Nagar (W)",
    "Welcome Colony"
  ],
  "Seelampur": [
    "Seelampur (W)",
    "Gautam Puri",
    "Chauhan Banger (W)",
    "Maujpur"
  ],
  "Ghonda": [
    "Braham Puri (W)",
    "Bhajanpura",
    "Ghonda (W)",
    "Yamuna Vihar"
  ],
  "Babarpur": [
    "Subash Mohalla (W)",
    "Kabir Nagar",
    "Gorakh Park (W)",
    "Kardam Puri"
  ],
  "Gokalpur": [
    "Harsh Vihar (SC-W)",
    "Saboli (SC)",
    "Gokal Puri (SC-W)",
    "Joharipur (SC)"
  ],
  "Mustafabad": [
    "Karawal Nagar-East (W)",
    "Dayalpur",
    "Mustafabad (W)",
    "Nehru Vihar",
    "Brij Puri (W)"
  ],
  "Karawal Nagar": [
    "Sri Ram Colony",
    "Sadatpur (W)",
    "Karawal Nagar-West",
    "Sonia Vihar (W)",
    "Sabapur"
  ]
};

/**
 * Comprehensive list of all 250 official MCD wards
 */
export const allWardsList: string[] = MCD_WARDS.map(w => w.raw_name);

// ==========================================
// Helper Functions for Electoral Lookups
// ==========================================

export function getConstituencyByNumber(acNumber: number): AssemblyConstituency | undefined {
  return ASSEMBLY_CONSTITUENCIES.find(c => c.ac_number === acNumber);
}

export function getConstituencyByName(name: string): AssemblyConstituency | undefined {
  const norm = name.trim().toLowerCase();
  return ASSEMBLY_CONSTITUENCIES.find(c => c.name.toLowerCase() === norm);
}

export function getWardsForConstituency(acNumberOrName: number | string): MCDWard[] {
  if (typeof acNumberOrName === 'number') {
    return MCD_WARDS.filter(w => w.ac_number === acNumberOrName);
  }
  const norm = acNumberOrName.trim().toLowerCase();
  return MCD_WARDS.filter(w => w.ac_name.toLowerCase() === norm);
}

export function getWardByNumber(wardNumber: number): MCDWard | undefined {
  return MCD_WARDS.find(w => w.ward_number === wardNumber);
}

export function searchWards(query: string): MCDWard[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return MCD_WARDS.filter(w => 
    w.name.toLowerCase().includes(q) || 
    w.raw_name.toLowerCase().includes(q) ||
    w.ac_name.toLowerCase().includes(q) ||
    w.zone.toLowerCase().includes(q) ||
    w.ward_number.toString() === q
  );
}
