import json
import sqlite3

config_path = r'C:\Users\Admin\.gemini\antigravity\brain\68553329-2ebf-4ca0-bfcd-ce5ff7e35ce2\scratch\template_config.json'
with open(config_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

db_path = r'e:\VINFAST\Mielove\backend\mielove.db'
conn = sqlite3.connect(db_path)
cur = conn.cursor()

config_json = json.dumps(data, ensure_ascii=False)
# Update all weddings that use template 12 with the latest config
cur.execute("UPDATE weddings SET config_data = ? WHERE template_id = 12", (config_json,))
conn.commit()
conn.close()

print("All weddings using template 12 have been updated with the latest config.")
