import json
import sqlite3

config_path = r'C:\Users\Admin\.gemini\antigravity\brain\68553329-2ebf-4ca0-bfcd-ce5ff7e35ce2\scratch\template_config.json'
with open(config_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

# Sync components with canvas.elements
data['components'] = data['canvas'].get('elements', [])

# Write back
with open(config_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

db_path = r'e:\VINFAST\Mielove\backend\mielove.db'
conn = sqlite3.connect(db_path)
cur = conn.cursor()

# Update master template 12
config_json = json.dumps(data, ensure_ascii=False)
cur.execute("UPDATE templates SET config_data = ? WHERE id = 12", (config_json,))

conn.commit()
conn.close()

print("Synced 'components' with 'canvas.elements' and updated master template.")
