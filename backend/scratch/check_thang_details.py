import json
import sqlite3

config_path = r'C:\Users\Admin\.gemini\antigravity\brain\68553329-2ebf-4ca0-bfcd-ce5ff7e35ce2\scratch\template_config.json'
with open(config_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

with open('backend/scratch/thang_elements.txt', 'w', encoding='utf-8') as out:
    for el in data['canvas']['elements']:
        if 3200 < el['y'] < 3350:
            out.write(f"type={el['type']} ID={el['id']} Y={el['y']} H={el['h']} W={el['w']} props={el.get('props')}\n")
