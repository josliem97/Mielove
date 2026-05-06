import json
import sqlite3

config_path = r'C:\Users\Admin\.gemini\antigravity\brain\68553329-2ebf-4ca0-bfcd-ce5ff7e35ce2\scratch\template_config.json'

with open(config_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

SHIFT_AMOUNT = 1500

# 1. Shift elements below Album
for el in data['canvas']['elements']:
    if el['y'] >= 7700:
        el['y'] += SHIFT_AMOUNT

# 2. Inject Bank Blocks at Y ~ 7800
bank_bride = {
    "id": "element_bank_bride123",
    "type": "element_bank",
    "x": 37.0,
    "y": 7800.0,
    "w": 500.0,
    "h": 650.0,
    "z": 2,
    "rotation": 0.0,
    "props": {
        "title": "Hộp quà hạnh phúc (Nhà Gái)",
        "bank_name": "Techcombank",
        "bank_account": "190367892345",
        "bank_account_name": "DIEU NHI",
        "bank_qr_code": "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=TCB-190367892345"
    },
    "style": {},
    "opacity": 1.0,
    "animation": {
        "preset": "miu-zoomIn",
        "duration": 1000,
        "delay": 0,
        "loop": 0
    }
}

bank_groom = {
    "id": "element_bank_groom123",
    "type": "element_bank",
    "x": 37.0,
    "y": 8500.0,
    "w": 500.0,
    "h": 650.0,
    "z": 2,
    "rotation": 0.0,
    "props": {
        "title": "Hộp quà hạnh phúc (Nhà Trai)",
        "bank_name": "Vietcombank",
        "bank_account": "001100412345",
        "bank_account_name": "THANH SON",
        "bank_qr_code": "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=VCB-001100412345"
    },
    "style": {},
    "opacity": 1.0,
    "animation": {
        "preset": "miu-zoomIn",
        "duration": 1000,
        "delay": 0,
        "loop": 0
    }
}

data['canvas']['elements'].extend([bank_bride, bank_groom])

# 3. Increase total canvas height
data['canvas']['height'] += SHIFT_AMOUNT

# 4. Save to config file
with open(config_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

# 5. Update Database
db_path = r'e:\VINFAST\Mielove\backend\mielove.db'
conn = sqlite3.connect(db_path)
cur = conn.cursor()

# Get the ID of the template with name 'Thanh Sơn - Diệu Nhi'
cur.execute("SELECT id FROM templates WHERE name = 'Thanh Sơn - Diệu Nhi'")
row = cur.fetchone()
if row:
    template_id = row[0]
    config_json = json.dumps(data, ensure_ascii=False)
    
    cur.execute("UPDATE templates SET config_data = ? WHERE id = ?", (config_json, template_id))
    cur.execute("UPDATE weddings SET config_data = ? WHERE template_id = ?", (config_json, template_id))
    conn.commit()
    print(f"Updated template {template_id} and corresponding weddings with Bank sections!")
else:
    print("Template not found in DB.")

conn.close()
