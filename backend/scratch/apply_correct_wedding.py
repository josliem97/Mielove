import json
import sqlite3
import sys

config_path = r'C:\Users\Admin\.gemini\antigravity\brain\68553329-2ebf-4ca0-bfcd-ce5ff7e35ce2\scratch\template_config.json'

with open(config_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

db_path = r'e:\VINFAST\Mielove\backend\mielove.db'
conn = sqlite3.connect(db_path)
cur = conn.cursor()

# Update the wedding directly
config_json = json.dumps(data, ensure_ascii=False)
cur.execute("UPDATE weddings SET config_data = ? WHERE slug = 'thanh-son-dieu-nhi-demo'", (config_json,))
conn.commit()
print(f"Updated wedding 'thanh-son-dieu-nhi-demo' with the latest config!")

# Also update the template ID 12 just in case
cur.execute("UPDATE templates SET config_data = ? WHERE id = 12", (config_json,))
conn.commit()
print(f"Updated template 12 with the latest config!")

conn.close()
