import json
import sqlite3

config_path = r'C:\Users\Admin\.gemini\antigravity\brain\68553329-2ebf-4ca0-bfcd-ce5ff7e35ce2\scratch\template_config.json'

with open(config_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

# Define exact Y positions to fix the layout neatly
# Album is at ~6921. Ends at ~8250
y_bank_bride = 8350
y_bank_groom = 9050
y_rsvp = 9800
y_countdown_text = 10550
y_countdown_block = 10650
y_wishes = 10800
y_thank_you = 11700
canvas_height = 11900

# Update the elements
for el in data['canvas']['elements']:
    if el['type'] == 'element_bank' and 'bride' in str(el.get('id', '')).lower():
        el['y'] = y_bank_bride
    elif el['type'] == 'element_bank' and 'groom' in str(el.get('id', '')).lower():
        el['y'] = y_bank_groom
    elif el['type'] == 'element_rsvp':
        el['y'] = y_rsvp
    elif el['type'] == 'element_text' and 'countdown' in str(el.get('props', {})).lower():
        el['y'] = y_countdown_text
    elif el['type'] == 'element_countdown':
        el['y'] = y_countdown_block
        # Ensure it has targetDate
        if not el['props']:
            el['props'] = {}
        el['props']['targetDate'] = '2026-12-31T09:00:00'
    elif el['type'] == 'element_wishes':
        el['y'] = y_wishes
    elif el['type'] == 'element_text' and 'Thank' in el.get('props', {}).get('text', ''):
        el['y'] = y_thank_you

# Update canvas height
data['canvas']['height'] = canvas_height

# Remove any decorative elements that are way out of bounds (Y > 12000)
data['canvas']['elements'] = [el for el in data['canvas']['elements'] if el.get('y', 0) < 12000]

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

print("Layout fixed! Overlaps and gaps removed.")
