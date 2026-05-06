import json

config_path = r'C:\Users\Admin\.gemini\antigravity\brain\68553329-2ebf-4ca0-bfcd-ce5ff7e35ce2\scratch\template_config.json'

with open(config_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

for el in data['canvas']['elements']:
    if el['type'] in ['element_wishes', 'element_button', 'element_countdown', 'element_album', 'element_bank']:
        print(f"ID: {el['id']}, Type: {el['type']}, Y: {el['y']:.1f}, H: {el['h']:.1f}, props: {list(el['props'].keys())}")
    elif el['type'] == 'element_text' and 'Thank' in el['props'].get('text', ''):
        print(f"ID: {el['id']}, Type: {el['type']}, Y: {el['y']:.1f}, H: {el['h']:.1f}, Text: {el['props'].get('text')}")
