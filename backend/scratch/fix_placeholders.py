import json
import sqlite3

config_path = r'C:\Users\Admin\.gemini\antigravity\brain\68553329-2ebf-4ca0-bfcd-ce5ff7e35ce2\scratch\template_config.json'
with open(config_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

for el in data['canvas']['elements']:
    if el['type'] == 'element_text':
        text = el.get('props', {}).get('text', '')
        if text == 'Thanh Sơn':
            el['props']['text'] = '{{groom_name}}'
        elif text == 'Diệu Nhi':
            el['props']['text'] = '{{bride_name}}'
        elif text == 'THANH SƠN':
            el['props']['text'] = '{{groom_name}}'
            el['props']['textTransform'] = 'uppercase'
        elif text == 'DIỆU NHI':
            el['props']['text'] = '{{bride_name}}'
            el['props']['textTransform'] = 'uppercase'
        elif text == '31.12.2026':
            el['props']['text'] = '{{wedding_date_dot}}'
        elif text == '31':
            # This is the day part of the calendar
            pass
        elif text == 'THÁNG 12':
            pass
        elif text == 'NĂM 2026':
            pass

# Save back to file
with open(config_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

db_path = r'e:\VINFAST\Mielove\backend\mielove.db'
conn = sqlite3.connect(db_path)
cur = conn.cursor()

# Update the master template (ID 12) to have the placeholders
config_json = json.dumps(data, ensure_ascii=False)
cur.execute("UPDATE templates SET config_data = ? WHERE id = 12", (config_json,))

conn.commit()
conn.close()

print("Master template placeholders fixed.")
