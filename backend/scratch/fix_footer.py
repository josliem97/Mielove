import json
import sqlite3

config_path = r'C:\Users\Admin\.gemini\antigravity\brain\68553329-2ebf-4ca0-bfcd-ce5ff7e35ce2\scratch\template_config.json'

with open(config_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

# The Wishes block is at Y=10800, H=775, so it ends at 11575.
# Let's shift the bottom elements down.
for el in data['canvas']['elements']:
    if el['id'] == 'element_image_sv299dr1bvw':
        el['y'] = 11700
        # Ensure it's rendered on top
        el['z'] = max(el.get('z', 0), 10)
    elif el['id'] == 'element_text_6eefqfc4hpc':  # "Thank you"
        el['y'] = 11850
        el['z'] = max(el.get('z', 0), 10)
    elif el['id'] == 'element_text_827c14h2ceo':  # "Cảm ơn bạn đã dành..."
        el['y'] = 11950
        el['z'] = max(el.get('z', 0), 10)

data['canvas']['height'] = 12300

with open(config_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

db_path = r'e:\VINFAST\Mielove\backend\mielove.db'
conn = sqlite3.connect(db_path)
cur = conn.cursor()

config_json = json.dumps(data, ensure_ascii=False)
cur.execute("UPDATE weddings SET config_data = ? WHERE slug = 'thanh-son-dieu-nhi-demo'", (config_json,))
cur.execute("UPDATE templates SET config_data = ? WHERE id = 12", (config_json,))
conn.commit()
conn.close()

print("Footer layout fixed! The Thank you section is now properly positioned below Wishes.")
