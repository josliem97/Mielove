import sqlite3
import json

db_path = 'e:/VINFAST/Mielove/backend/mielove.db'
conn = sqlite3.connect(db_path)
cur = conn.cursor()

print("--- ALL WEDDING SLUGS ---")
cur.execute("SELECT id, slug, template_id FROM weddings")
for w in cur.fetchall():
    print(f"ID: {w[0]} | Slug: {w[1]} | TplID: {w[2]}")

conn.close()
