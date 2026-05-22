import json

states = [
  {"id": "an", "name": "Andaman and Nicobar Islands", "name_hi": "अंडमान और निकोबार द्वीप समूह", "serial": 1},
  {"id": "ap", "name": "Andhra Pradesh", "name_hi": "आंध्र प्रदेश", "serial": 2},
  {"id": "ar", "name": "Arunachal Pradesh", "name_hi": "अरुणाचल प्रदेश", "serial": 3},
  {"id": "as", "name": "Assam", "name_hi": "असम", "serial": 4},
  {"id": "br", "name": "Bihar", "name_hi": "बिहार", "serial": 5},
  {"id": "ch", "name": "Chandigarh", "name_hi": "चंडीगढ़", "serial": 6},
  {"id": "cg", "name": "Chhattisgarh", "name_hi": "छत्तीसगढ़", "serial": 7},
  {"id": "dn", "name": "Dadra and Nagar Haveli and Daman and Diu", "name_hi": "दादरा और नगर हवेली और दमन और दीव", "serial": 8},
  {"id": "dl", "name": "Delhi", "name_hi": "दिल्ली", "serial": 9},
  {"id": "ga", "name": "Goa", "name_hi": "गोवा", "serial": 10},
  {"id": "gj", "name": "Gujarat", "name_hi": "गुजरात", "serial": 11},
  {"id": "hr", "name": "Haryana", "name_hi": "हरियाणा", "serial": 12},
  {"id": "hp", "name": "Himachal Pradesh", "name_hi": "हिमाचल प्रदेश", "serial": 13},
  {"id": "jk", "name": "Jammu and Kashmir", "name_hi": "जम्मू और कश्मीर", "serial": 14},
  {"id": "jh", "name": "Jharkhand", "name_hi": "झारखंड", "serial": 15},
  {"id": "ka", "name": "Karnataka", "name_hi": "कर्नाटक", "serial": 16},
  {"id": "kl", "name": "Kerala", "name_hi": "केरल", "serial": 17},
  {"id": "la", "name": "Ladakh", "name_hi": "लद्दाख", "serial": 18},
  {"id": "ld", "name": "Lakshadweep", "name_hi": "लक्षद्वीप", "serial": 19},
  {"id": "mp", "name": "Madhya Pradesh", "name_hi": "मध्य प्रदेश", "serial": 20},
  {"id": "mh", "name": "Maharashtra", "name_hi": "महाराष्ट्र", "serial": 21},
  {"id": "mn", "name": "Manipur", "name_hi": "मणिपुर", "serial": 22},
  {"id": "ml", "name": "Meghalaya", "name_hi": "मेघालय", "serial": 23},
  {"id": "mz", "name": "Mizoram", "name_hi": "मिजोरम", "serial": 24},
  {"id": "nl", "name": "Nagaland", "name_hi": "नागालैंड", "serial": 25},
  {"id": "or", "name": "Odisha", "name_hi": "ओडिशा", "serial": 26},
  {"id": "py", "name": "Puducherry", "name_hi": "पुडुचेरी", "serial": 27},
  {"id": "pb", "name": "Punjab", "name_hi": "पंजाब", "serial": 28},
  {"id": "rj", "name": "Rajasthan", "name_hi": "राजस्थान", "serial": 29},
  {"id": "sk", "name": "Sikkim", "name_hi": "सिक्किम", "serial": 30},
  {"id": "tn", "name": "Tamil Nadu", "name_hi": "तमिलनाडु", "serial": 31},
  {"id": "tg", "name": "Telangana", "name_hi": "तेलंगाना", "serial": 32},
  {"id": "tr", "name": "Tripura", "name_hi": "त्रिपुरा", "serial": 33},
  {"id": "up", "name": "Uttar Pradesh", "name_hi": "उत्तर प्रदेश", "serial": 34},
  {"id": "uk", "name": "Uttarakhand", "name_hi": "उत्तराखंड", "serial": 35},
  {"id": "wb", "name": "West Bengal", "name_hi": "पश्चिम बंगाल", "serial": 36}
]

# For demonstration, we'll generate 5 Vidhan Sabhas per state, and 10 Wards per Vidhan Sabha.
# A real implementation would pull from ECI datasets.

with open("seed.sql", "w", encoding="utf-8") as f:
    f.write("DELETE FROM wards;\n")
    f.write("DELETE FROM vidhan_sabhas;\n")
    f.write("DELETE FROM states;\n\n")

    for state in states:
        f.write(f"INSERT INTO states (id, name, name_hi, serial_no) VALUES ('{state['id']}', '{state['name']}', '{state['name_hi']}', {state['serial']});\n")
        
        # Add Vidhan Sabhas
        for vs_num in range(1, 6):
            vs_id = f"{state['id']}-vs-{vs_num}"
            vs_name = f"Vidhan Sabha {vs_num} ({state['name']})"
            f.write(f"INSERT INTO vidhan_sabhas (id, state_id, name, serial_no) VALUES ('{vs_id}', '{state['id']}', '{vs_name}', {vs_num});\n")
            
            # Add Wards
            for ward_num in range(1, 11):
                ward_id = f"{vs_id}-w-{ward_num}"
                ward_name = f"Ward {ward_num}"
                f.write(f"INSERT INTO wards (id, vidhan_sabha_id, name, serial_no) VALUES ('{ward_id}', '{vs_id}', '{ward_name}', {ward_num});\n")
    
    f.write("\n-- End of seed data\n")
