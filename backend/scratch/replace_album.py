import json
import os
from PIL import Image
import sqlite3

config_path = r'C:\Users\Admin\.gemini\antigravity\brain\68553329-2ebf-4ca0-bfcd-ce5ff7e35ce2\scratch\template_config.json'
with open(config_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

# Find the album
album_idx = -1
album_el = None
for i, el in enumerate(data['canvas']['elements']):
    if el['type'] == 'element_album':
        album_idx = i
        album_el = el
        break

if not album_el:
    print("Album not found!")
    exit(0)

images = album_el.get('props', {}).get('images', [])
start_y = album_el['y']
old_h = album_el['h']
album_end_y = start_y + old_h

# Calculate new layout
col_y = [start_y, start_y]
new_elements = []

for idx, img_url in enumerate(images):
    local_path = r'e:\VINFAST\Mielove\frontend\public' + img_url.replace('/', '\\')
    orig_w, orig_h = 1000, 1000 # default
    if os.path.exists(local_path):
        with Image.open(local_path) as im:
            orig_w, orig_h = im.size
            
    # Calculate dimensions
    img_w = 272 # (564 - 20) / 2
    img_h = img_w * (orig_h / orig_w)
    
    # Pick column
    col = 0 if col_y[0] <= col_y[1] else 1
    x = 0 if col == 0 else 292
    y = col_y[col]
    
    new_el = {
        "id": f"element_image_album_generated_{idx}",
        "type": "element_image",
        "x": x,
        "y": y,
        "w": img_w,
        "h": img_h,
        "z": 2,
        "props": {
            "src": img_url,
            "objectFit": "cover",
            "borderRadius": 16,
            "borderWidth": 3,
            "borderColor": "#ffffff",
            "boxShadow": "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            "className": "hover:scale-[1.02] transition-transform duration-500"
        }
    }
    new_elements.append(new_el)
    col_y[col] += img_h + 20

new_album_end_y = max(col_y)
delta_y = new_album_end_y - album_end_y

# Remove the old album
del data['canvas']['elements'][album_idx]

# Shift all elements that were below the old album
for el in data['canvas']['elements']:
    if el['y'] > album_end_y - 10:
        el['y'] += delta_y

# Add the new elements
data['canvas']['elements'].extend(new_elements)

# Increase canvas height
data['canvas']['height'] += delta_y

# Save back
with open(config_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

# Sync to DB
db_path = r'e:\VINFAST\Mielove\backend\mielove.db'
conn = sqlite3.connect(db_path)
cur = conn.cursor()

config_json = json.dumps(data, ensure_ascii=False)
cur.execute("UPDATE templates SET config_data = ? WHERE id = 12", (config_json,))
cur.execute("UPDATE weddings SET config_data = ? WHERE template_id = 12", (config_json,))

conn.commit()
conn.close()

print(f"Replaced album with {len(new_elements)} individual images.")
print(f"Shifted elements down by {delta_y} pixels.")
