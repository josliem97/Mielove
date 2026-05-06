import sqlite3
import json

db_path = r'e:\VINFAST\Mielove\backend\mielove.db'
conn = sqlite3.connect(db_path)
cur = conn.cursor()
cur.execute('SELECT id, slug, config_data FROM weddings')
for row in cur.fetchall():
    w_id, slug, config = row
    if not config:
        print(f"Wedding ID={w_id} Slug={slug} NO CONFIG")
        continue
    data = json.loads(config)
    album_count = sum(1 for el in data['canvas']['elements'] if el['type'] == 'element_album')
    img_count = sum(1 for el in data['canvas']['elements'] if el['type'] == 'element_image')
    print(f"Wedding ID={w_id} Slug={slug} Albums={album_count} Images={img_count}")
