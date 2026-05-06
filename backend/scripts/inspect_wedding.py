import sqlite3
import json

db_path = 'e:/VINFAST/Mielove/backend/mielove.db'
conn = sqlite3.connect(db_path)
cur = conn.cursor()

slug = 'quang-huy-th'
cur.execute("SELECT config_data FROM weddings WHERE slug=?", (slug,))
row = cur.fetchone()

if row:
    config = json.loads(row[0])
    print(f"--- CONFIG FOR {slug} ---")
    print(f"Keys: {config.keys()}")
    comps = config.get('components', [])
    print(f"Total Components: {len(comps)}")
    if comps:
        print(f"First component: {comps[0]}")
else:
    print(f"Wedding {slug} not found.")

conn.close()
