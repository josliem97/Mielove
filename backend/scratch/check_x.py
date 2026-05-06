import json

config_path = r'C:\Users\Admin\.gemini\antigravity\brain\68553329-2ebf-4ca0-bfcd-ce5ff7e35ce2\scratch\template_config.json'
with open(config_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

for el in data['canvas']['elements']:
    if el['id'] in ['element_text_gl60cd9zjwu', 'element_text_hnr8lps1hsi']:
        print(f"ID={el['id']} X={el['x']} Y={el['y']} W={el['w']} text={el.get('props', {}).get('text')}")
