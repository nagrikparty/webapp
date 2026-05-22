import urllib.request
import urllib.parse
import json

query = """
SELECT ?stateLabel ?constituencyLabel WHERE {
  ?constituency wdt:P31 wd:Q18536155.
  ?constituency wdt:P131 ?state.
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
}
"""

url = "https://query.wikidata.org/sparql?query=" + urllib.parse.quote(query) + "&format=json"

req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})

try:
    with urllib.request.urlopen(req) as response:
        data = json.loads(response.read().decode())
        results = data['results']['bindings']
        
        # Group by state
        states_data = {}
        for row in results:
            state = row['stateLabel']['value']
            const = row['constituencyLabel']['value']
            
            # Clean up names like "Narela Assembly constituency"
            const = const.replace(" Assembly constituency", "").replace(" assembly constituency", "")
            
            if state not in states_data:
                states_data[state] = []
            states_data[state].append(const)
            
        print(f"Total states/UTs found: {len(states_data)}")
        total_consts = sum(len(c) for c in states_data.values())
        print(f"Total constituencies found: {total_consts}")
        
        with open("wikidata_constituencies.json", "w", encoding="utf-8") as f:
            json.dump(states_data, f, indent=2)
except Exception as e:
    print(f"Error: {e}")
