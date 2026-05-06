import json
import os
from PIL import Image

config_path = r'C:\Users\Admin\.gemini\antigravity\brain\68553329-2ebf-4ca0-bfcd-ce5ff7e35ce2\scratch\template_config.json'
with open(config_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

for el in data['canvas']['elements']:
    if el['type'] == 'element_album':
        images = el.get('props', {}).get('images', [])
        
for img_url in images:
    # img_url is like /uploads/...
    # Local path: e:\VINFAST\Mielove\frontend\public + img_url
    local_path = r'e:\VINFAST\Mielove\frontend\public' + img_url.replace('/', '\\')
    if os.path.exists(local_path):
        with Image.open(local_path) as im:
            print(f"{img_url}: {im.size}")
    else:
        print(f"NOT FOUND: {local_path}")
