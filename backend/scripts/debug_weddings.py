import sqlite3
import json

db_path = 'e:/VINFAST/Mielove/backend/mielove.db'
conn = sqlite3.connect(db_path)
cur = conn.cursor()

print("--- Existing Weddings ---")
cur.execute('SELECT id, slug, template_id, config_data FROM weddings')
rows = cur.fetchall()
for r in rows:
    wid, slug, tid, config = r
    try:
        config_obj = json.loads(config) if config else {}
        comp_count = len(config_obj.get('components', []))
        print(f"ID: {wid} | Slug: {slug} | TemplateID: {tid} | Component Count: {comp_count}")
    except:
        print(f"ID: {wid} | Slug: {slug} | Error parsing JSON")

print("\n--- Master Template 53 ---")
cur.execute('SELECT id, name, config_data FROM templates WHERE id=53 OR name LIKE "%53%"')
templates = cur.fetchall()
for t in templates:
    tid, name, config = t
    config_obj = json.loads(config) if config else {}
    comp_count = len(config_obj.get('components', []))
    print(f"ID: {tid} | Name: {name} | Master Component Count: {comp_count}")

conn.close()
