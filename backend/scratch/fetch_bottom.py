import sqlite3
import json

conn = sqlite3.connect(r'e:\VINFAST\Mielove\backend\mielove.db')
cur = conn.cursor()
cur.execute('SELECT config_data FROM templates WHERE id = 2')
row = cur.fetchone()
if row:
    data = json.loads(row[0])
    with open('backend/scratch/bottom_elements.txt', 'w', encoding='utf-8') as f:
        f.write("--- Bottom elements in Template 2 ---\n")
        # Elements originally above 7700 got shifted +1500. So look > 10500
        for el in data['canvas']['elements']:
            if el['y'] > 10500:
                f.write(f"{el['type']} ID={el['id']} Y={el['y']}, Text: {el.get('props', {}).get('text', '')}\n")
