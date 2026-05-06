import sqlite3
import sys

sys.stdout.reconfigure(encoding='utf-8')

conn = sqlite3.connect('backend/mielove.db')
cursor = conn.cursor()
cursor.execute("SELECT id, slug, template_id FROM weddings")
for row in cursor.fetchall():
    print(row)
conn.close()
