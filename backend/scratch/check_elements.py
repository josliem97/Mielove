import json

config_path = r'C:\Users\Admin\.gemini\antigravity\brain\68553329-2ebf-4ca0-bfcd-ce5ff7e35ce2\scratch\template_config.json'

with open(config_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

for el in data['canvas']['elements']:
    if 'rsvp' in el['type'].lower() or 'form' in el['type'].lower():
        print(f"Found: {el['type']} at Y={el['y']}, H={el['h']}")
    
print("--- Check Album ---")
for el in data['canvas']['elements']:
    if el['type'] == 'element_album':
        images = el['props'].get('images', [])
        print(f"Album ID: {el['id']}, Y={el['y']}, H={el['h']}, num_images={len(images)}")
