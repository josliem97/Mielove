import json
import sqlite3
import copy
from datetime import datetime

config_path = r'C:\Users\Admin\.gemini\antigravity\brain\68553329-2ebf-4ca0-bfcd-ce5ff7e35ce2\scratch\template_config.json'
with open(config_path, 'r', encoding='utf-8') as f:
    master_config = json.load(f)

def replace_placeholders(obj, data_map):
    if isinstance(obj, dict):
        return {k: replace_placeholders(v, data_map) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [replace_placeholders(v, data_map) for v in obj]
    elif isinstance(obj, str):
        for key, val in data_map.items():
            if val is not None:
                obj = obj.replace(f"{{{{{key}}}}}", str(val))
        return obj
    return obj

db_path = r'e:\VINFAST\Mielove\backend\mielove.db'
conn = sqlite3.connect(db_path)
cur = conn.cursor()

cur.execute("SELECT id, groom_name, bride_name, wedding_date, location FROM weddings WHERE template_id = 12")
weddings = cur.fetchall()

for row in weddings:
    w_id, groom, bride, date_str, loc = row
    
    d_iso = date_str.split('T')[0] if (date_str and 'T' in date_str) else date_str
    d_obj = None
    if d_iso:
        try: d_obj = datetime.strptime(d_iso, '%Y-%m-%d')
        except: pass
    
    dot_date = d_obj.strftime('%d . %m . %Y') if d_obj else (d_iso or "Chưa xác định")
    display_date = d_obj.strftime('%d/%m/%Y') if d_obj else (d_iso or "Chưa xác định")
    time_str = date_str.split('T')[1] if (date_str and 'T' in date_str) else "09:00"

    data_map = {
        "groom_name": groom or "Chú rể",
        "bride_name": bride or "Cô dâu",
        "wedding_date": d_iso or "Chưa xác định",
        "wedding_date_dot": dot_date,
        "wedding_date_display": display_date,
        "wedding_time": time_str,
        "location": loc or "Địa điểm chưa xác định"
    }
    
    wedding_config = copy.deepcopy(master_config)
    wedding_config = replace_placeholders(wedding_config, data_map)
    
    cur.execute("UPDATE weddings SET config_data = ? WHERE id = ?", (json.dumps(wedding_config, ensure_ascii=False), w_id))

conn.commit()
conn.close()

print("Weddings successfully re-personalized with the latest config.")
