import sqlite3
import json

conn = sqlite3.connect(r'e:\VINFAST\Mielove\backend\mielove.db')
cur = conn.cursor()
cur.execute('SELECT config_data FROM templates WHERE id = 2')
row = cur.fetchone()
if row:
    data = json.loads(row[0])
    print("--- Bottom elements in Template 2 ---")
    for el in data['canvas']['elements']:
        if el['y'] > 10500:
            print(f"{el['type']} ID={el['id']} Y={el['y']}, Text: {el.get('props', {}).get('text', '')}")
