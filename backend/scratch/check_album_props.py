import json

config_path = r'C:\Users\Admin\.gemini\antigravity\brain\68553329-2ebf-4ca0-bfcd-ce5ff7e35ce2\scratch\template_config.json'
with open(config_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

for el in data['canvas']['elements']:
    if el['type'] == 'element_album':
        with open('backend/scratch/album_images.txt', 'w', encoding='utf-8') as out:
            out.write(json.dumps(el.get('props', {}).get('images', []), indent=2))
