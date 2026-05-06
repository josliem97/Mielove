import json
import sqlite3

config_path = r'C:\Users\Admin\.gemini\antigravity\brain\68553329-2ebf-4ca0-bfcd-ce5ff7e35ce2\scratch\template_config.json'
with open(config_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

print("Elements around Y=3260..3300:")
for el in data['canvas']['elements']:
    if el['type'] == 'element_text' and 3200 < el['y'] < 3350:
        print(f"ID={el['id']} Y={el['y']} text={repr(el.get('props', {}).get('text'))}")
