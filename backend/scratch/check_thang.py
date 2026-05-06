import json
import sqlite3

config_path = r'C:\Users\Admin\.gemini\antigravity\brain\68553329-2ebf-4ca0-bfcd-ce5ff7e35ce2\scratch\template_config.json'
with open(config_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

for el in data['canvas']['elements']:
    if el['type'] == 'element_text' and 'THÁNG' in el.get('props', {}).get('text', '').upper():
        print(f"THANG: ID={el['id']} Y={el['y']} H={el['h']}")
    if el['type'] == 'element_text' and el.get('props', {}).get('text', '').strip() == '12':
        print(f"12: ID={el['id']} Y={el['y']} H={el['h']}")
