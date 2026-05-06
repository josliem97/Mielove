import sqlite3
import json
import copy

db_path = 'e:/VINFAST/Mielove/backend/mielove.db'
conn = sqlite3.connect(db_path)
cur = conn.cursor()

def replace_placeholders(obj, data_map):
    if isinstance(obj, dict):
        # Fix countdown element's targetDate on the fly
        new_obj = {k: replace_placeholders(v, data_map) for k, v in obj.items()}
        if new_obj.get('type') == 'element_countdown':
            new_obj.setdefault('props', {})
            if data_map.get('wedding_date'):
                # Strip any existing time portion (e.g. "2026-04-25T09:02" -> "2026-04-25")
                date_part = str(data_map['wedding_date']).split('T')[0]
                new_obj['props']['targetDate'] = date_part + 'T09:00:00'
        return new_obj
    elif isinstance(obj, list):
        return [replace_placeholders(v, data_map) for v in obj]
    elif isinstance(obj, str):
        for key, val in data_map.items():
            if val is not None:
                # Handle |upper filter
                obj = obj.replace(f"{{{{{key}|upper}}}}", str(val).upper())
                obj = obj.replace(f"{{{{{key}}}}}", str(val))
        return obj
    return obj

# 1. Get Master Config
cur.execute('SELECT config_data FROM templates WHERE id=1')
master_config_str = cur.fetchone()[0]
master_config = json.loads(master_config_str)

# 2. Get ALL Weddings for Universal Upgrade
cur.execute('SELECT id, slug, groom_name, bride_name, wedding_date, location FROM weddings')
weddings = cur.fetchall()

print(f"Syncing {len(weddings)} weddings to latest Master 53 config...")

for w in weddings:
    wid, slug, groom, bride, date, loc = w
    
    # Prepare data map
    data_map = {
        "groom_name": groom or "Chương",
        "bride_name": bride or "Hoà",
        "wedding_date": date or "2026-04-20",
        "wedding_time": "09:30",
        "location": loc or "Địa điểm mặc định"
    }
    
    # Create fresh config from master
    new_config = copy.deepcopy(master_config)
    new_config = replace_placeholders(new_config, data_map)
    
    # Update wedding structure & template link
    cur.execute('UPDATE weddings SET config_data = ?, template_id = 1 WHERE id = ?', (json.dumps(new_config, ensure_ascii=False), wid))
    print(f"Updated slug: {slug} (Promoted to Master VIP)")

conn.commit()
conn.close()
print("All weddings synchronized successfully.")
