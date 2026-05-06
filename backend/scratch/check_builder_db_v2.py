import sqlite3
import json

db_path = r'e:\VINFAST\Mielove\backend\mielove.db'
conn = sqlite3.connect(db_path)
cur = conn.cursor()
cur.execute('SELECT id, slug, template_id, config_data FROM weddings')
for row in cur.fetchall():
    w_id, slug, t_id, config = row
    if not config:
        print(f"Wedding ID={w_id} Slug={slug} NO CONFIG")
        continue
    data = json.loads(config)
    
    if 'canvas' in data and 'elements' in data['canvas']:
        album_count = sum(1 for el in data['canvas']['elements'] if el['type'] == 'element_album')
        img_count = sum(1 for el in data['canvas']['elements'] if el['type'] == 'element_image')
        print(f"Wedding ID={w_id} Slug={slug} Template={t_id} Albums={album_count} Images={img_count}")
        # Let's also check if groom_name is injected correctly!
        texts = [el.get('props', {}).get('text', '') for el in data['canvas']['elements'] if el['type'] == 'element_text']
        sample = next((t for t in texts if '{{' in t or t == 'Thanh Sơn'), None)
        print(f"  -> Sample text: {sample}")
    else:
        print(f"Wedding ID={w_id} Slug={slug} Template={t_id} NON-CANVAS CONFIG")
