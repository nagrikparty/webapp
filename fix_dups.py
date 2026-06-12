import json
from collections import Counter

with open('src/lib/delhi_data.ts', 'r', encoding='utf-8') as f:
    text = f.read()

# Only extract from delhiConstituenciesAndWards
ward_text = text.split('export const delhiConstituenciesAndWards')[1].split('};')[0]

mapped_wards = []
for line in ward_text.split('\n'):
    if ':' in line and '["' in line:
        arr_str = line.split(':')[1].strip().rstrip(',')
        if arr_str.startswith('['):
            try:
                arr = json.loads(arr_str)
                for w in arr: mapped_wards.append(w)
            except Exception as e:
                print('Error parsing:', arr_str)

c = Counter(mapped_wards)
duplicates = [w for w, count in c.items() if count > 1]
print('Total mapped wards (including duplicates):', len(mapped_wards))
print('Duplicates:', len(duplicates))
for d in duplicates:
    print(d, c[d])
