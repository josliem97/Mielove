import sqlite3, json

conn = sqlite3.connect('e:/VINFAST/Mielove/backend/mielove.db')
cur = conn.cursor()
cur.execute("SELECT slug, config_data FROM weddings")
rows = cur.fetchall()

for slug, cfg in rows:
    config = json.loads(cfg)
    canvas = config.get('canvas', {})
    elements = canvas.get('elements', [])
    # Find groom name text node
    names = [e for e in elements if e.get('type') == 'element_text' and e.get('props', {}).get('fontFamily', '') == 'Lora' and 'y' in e and e['y'] < 1000]
    cd = [e for e in elements if e.get('type') == 'element_countdown']
    print(f"Slug: {slug}")
    print(f"  Canvas height: {canvas.get('height')}, Elements: {len(elements)}")
    for n in names[:3]:
        print(f"  Name element: {n['props'].get('text')}")
    if cd:
        print(f"  Countdown targetDate: {cd[0]['props'].get('targetDate')}")
    print()

conn.close()
