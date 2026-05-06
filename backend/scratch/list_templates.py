import sqlite3
conn = sqlite3.connect('backend/mielove.db')
cursor = conn.cursor()
cursor.execute("SELECT id, name FROM templates")
for row in cursor.fetchall():
    print(row)
conn.close()
