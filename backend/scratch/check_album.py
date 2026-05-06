import sqlite3
import json

conn = sqlite3.connect(r'e:\VINFAST\Mielove\backend\mielove.db')
cur = conn.cursor()
cur.execute('SELECT config_data FROM templates WHERE id = 12')
row = cur.fetchone()
if row:
    data = json.loads(row[0])
    with open('backend/scratch/check_album.txt', 'w', encoding='utf-8') as f:
        for el in data['canvas']['elements']:
            if 'album' in el['type'].lower() or 'gallery' in el['type'].lower() or (el['type'] == 'element_image' and el['y'] > 6000 and el['y'] < 8000):
                f.write(f"Type: {el['type']}, ID: {el['id']}, Y: {el['y']}, W: {el['w']}, H: {el['h']}, src: {el.get('props', {}).get('src', '')}\n")
conn.close()
