import json
import sqlite3

db_path = r'e:\VINFAST\Mielove\backend\mielove.db'
conn = sqlite3.connect(db_path)
cur = conn.cursor()
cur.execute('SELECT config_data FROM templates WHERE id = 12')
row = cur.fetchone()
if row:
    data = json.loads(row[0])
    with open('backend/scratch/check_placeholders.txt', 'w', encoding='utf-8') as f:
        for el in data['canvas']['elements']:
            text = el.get('props', {}).get('text', '')
            if 'THANH SƠN' in text.upper() or 'DIỆU NHI' in text.upper() or '2026' in text or '{{' in text:
                f.write(f"ID={el['id']} Text='{text}'\n")
