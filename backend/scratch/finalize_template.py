import json
import sqlite3

config_path = r'C:\Users\Admin\.gemini\antigravity\brain\68553329-2ebf-4ca0-bfcd-ce5ff7e35ce2\scratch\template_config.json'
with open(config_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

# Fix calendar wrapping issues
for el in data['canvas']['elements']:
    if el['type'] == 'element_text' and 'THÁNG' in el.get('props', {}).get('text', '').upper():
        old_w = el['w']
        el['w'] = 200
        el['x'] -= (200 - old_w) / 2
    elif el['type'] == 'element_text' and 'NĂM' in el.get('props', {}).get('text', '').upper():
        old_w = el['w']
        el['w'] = 200
        el['x'] -= (200 - old_w) / 2

with open(config_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

db_path = r'e:\VINFAST\Mielove\backend\mielove.db'
conn = sqlite3.connect(db_path)
cur = conn.cursor()

# 1. Update the final template (ID 12)
config_json = json.dumps(data, ensure_ascii=False)
cur.execute("UPDATE templates SET config_data = ? WHERE id = 12", (config_json,))

# 2. Update the demo wedding to use ID 12 and the latest config
cur.execute("UPDATE weddings SET template_id = 12, config_data = ? WHERE slug = 'thanh-son-dieu-nhi-demo'", (config_json,))

# 3. Delete all other 'Thanh Sơn - Diệu Nhi' templates to clean up the builder/homepage
cur.execute("DELETE FROM templates WHERE name = 'Thanh Sơn - Diệu Nhi' AND id != 12")

# Also delete any that might be named slightly differently if they are duplicates
cur.execute("DELETE FROM templates WHERE name LIKE '%Thanh Sơn%' AND id != 12")

conn.commit()
conn.close()

print("Calendar overlapping fixed. Duplicates cleaned up. Template 12 is the final master.")
