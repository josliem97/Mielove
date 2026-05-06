import json
import sqlite3

config_path = r'C:\Users\Admin\.gemini\antigravity\brain\68553329-2ebf-4ca0-bfcd-ce5ff7e35ce2\scratch\template_config.json'

with open(config_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

# Find and remove the floating "QUÀ MỪNG CƯỚI" button if it exists
new_elements = []
for el in data['canvas']['elements']:
    if el['type'] == 'element_button' and 'QUÀ MỪNG CƯỚI' in el['props'].get('text', '').upper():
        print(f"Removing floating button: {el['id']}")
    else:
        new_elements.append(el)

data['canvas']['elements'] = new_elements

# Save back to JSON
with open(config_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

# Update database
db_path = r'e:\VINFAST\Mielove\backend\mielove.db'
conn = sqlite3.connect(db_path)
cur = conn.cursor()

config_json = json.dumps(data, ensure_ascii=False)
cur.execute("UPDATE weddings SET config_data = ? WHERE slug = 'thanh-son-dieu-nhi-demo'", (config_json,))
cur.execute("UPDATE templates SET config_data = ? WHERE id = 12", (config_json,))
conn.commit()
conn.close()

print("Cleaned up floating buttons and updated db!")
