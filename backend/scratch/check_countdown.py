import json

config_path = r'C:\Users\Admin\.gemini\antigravity\brain\68553329-2ebf-4ca0-bfcd-ce5ff7e35ce2\scratch\template_config.json'

with open(config_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

for el in data['canvas']['elements']:
    if el['type'] == 'element_text' and 'countdown' in str(el.get('props', {})).lower():
        print(f"Found text: {el['props']['text']} at Y={el['y']}")

    if el['type'] == 'element_countdown':
        print(f"Countdown block at Y={el['y']}")

print("---")
