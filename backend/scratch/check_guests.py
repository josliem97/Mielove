import sqlite3

conn = sqlite3.connect('backend/mielove.db')
cursor = conn.cursor()
cursor.execute("PRAGMA table_info(guests)")
print("Guests columns:", cursor.fetchall())
conn.close()
