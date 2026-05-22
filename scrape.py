import urllib.request
import json
import re

states = [
    "Andhra_Pradesh", "Arunachal_Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", 
    "Gujarat", "Haryana", "Himachal_Pradesh", "Jharkhand", "Karnataka", "Kerala", 
    "Madhya_Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", 
    "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil_Nadu", "Telangana", "Tripura", 
    "Uttar_Pradesh", "Uttarakhand", "West_Bengal", "Delhi", "Puducherry"
]

all_data = {}

for state in states:
    print(f"Fetching {state}...")
    url = f"https://en.wikipedia.org/w/api.php?action=parse&page=List_of_constituencies_of_the_{state}_Legislative_Assembly&prop=wikitext&format=json&section=1"
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode())
            wikitext = data.get("parse", {}).get("wikitext", {}).get("*", "")
            
            # Extract constituencies using regex looking for row start |-, then a number, then the constituency name.
            # Typical format: 
            # |-
            # | 1
            # ! scope=row | [[Narela, Delhi Assembly constituency|Narela]]
            # OR
            # |-
            # | 1 || [[ConstName]]
            
            # Let's extract all wikilinks that might be constituencies.
            # Since Wikipedia tables are messy, we can use regex to find lines that define a row and extract the first link.
            
            constituencies = []
            
            # A rough parser for wiki tables
            lines = wikitext.split("\n")
            in_row = False
            current_col_idx = 0
            current_const = None
            
            for line in lines:
                line = line.strip()
                if line == "|-":
                    in_row = True
                    current_col_idx = 0
                    continue
                
                if in_row and line.startswith("|") and not line.startswith("|+") and not line.startswith("|}Style"):
                    # it could be a column
                    # some columns are inline like | 1 || [[Name]]
                    # or multi-line
                    parts = re.split(r'\|\|', line)
                    for part in parts:
                        part = part.strip()
                        if not part: continue
                        if part.startswith("|") and not part.startswith("||"):
                            part = part[1:].strip()
                        if part.startswith("!"):
                            part = part[part.find("|")+1:].strip() if "|" in part else part[1:].strip()
                        
                        # Find link
                        m = re.search(r'\[\[(.*?)\]\]', part)
                        if m:
                            link_content = m.group(1)
                            name = link_content.split("|")[-1].strip()
                            # check if it looks like a constituency name (not a district or something else)
                            # usually the first link in the 2nd column is the constituency
                            # We can just collect all names and filter later, but let's be smart.
                            if current_col_idx == 1: # usually 2nd col is name
                                if " district" not in name.lower() and " lok sabha" not in name.lower():
                                    constituencies.append(name)
                        current_col_idx += 1
                        
                elif in_row and line.startswith("!") and "scope=row" in line:
                    # e.g. ! scope=row | [[Narela]]
                    part = line[line.find("|")+1:].strip()
                    m = re.search(r'\[\[(.*?)\]\]', part)
                    if m:
                        link_content = m.group(1)
                        name = link_content.split("|")[-1].strip()
                        constituencies.append(name)
                    current_col_idx += 1

            
            # Since the regex above is brittle, let's use a simpler heuristic.
            # In a wikitable, lines with [[ConstName]] right after a number are usually the constituencies.
            
            # Let's do a pure regex on the whole text:
            # find patterns like `| 1\n| [[Name]]` or `| 1 || [[Name]]` or `! scope=row | [[Name]]`
            
            # Alternate approach: just extract all links, and we can manually clean if there are errors, but that's too much data.
            # Let's print out what we found to see if it's accurate:
            print(f"Found {len(constituencies)} for {state}. First 3: {constituencies[:3]}")
            
            # Dedup and preserve order
            seen = set()
            clean_const = []
            for c in constituencies:
                # Remove ref tags if any
                c = re.sub(r'<ref.*?>.*?</ref>', '', c)
                c = re.sub(r'<.*?>', '', c)
                if c not in seen and len(c) > 2:
                    seen.add(c)
                    clean_const.append(c)
            
            all_data[state] = clean_const
    except Exception as e:
        print(f"Error on {state}: {e}")

with open("india_geo_raw.json", "w", encoding="utf-8") as f:
    json.dump(all_data, f, indent=2)

print("Done")
