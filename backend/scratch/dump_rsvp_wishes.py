import json

config_path = r'C:\Users\Admin\.gemini\antigravity\brain\68553329-2ebf-4ca0-bfcd-ce5ff7e35ce2\scratch\template_config.json'

with open(config_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

for el in data['canvas']['elements']:
    if 'rsvp' in el['type'].lower() or 'form' in el['type'].lower():
        print(f"RSVP/Form: {el}")
    elif el['type'] == 'element_wishes':
        print(f"Wishes: {el}")
    elif 'count' in el['type'].lower() or 'time' in el['type'].lower():
        print(f"Count/Time: {el['type']} ID={el['id']} Props={el['props']}")
