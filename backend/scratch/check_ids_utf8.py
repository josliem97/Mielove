import sqlite3
import sys

# Set output encoding to UTF-8
sys.stdout.reconfigure(encoding='utf-8')

conn = sqlite3.connect('backend/mielove.db')
cursor = conn.cursor()
cursor.execute("SELECT id, name FROM templates")
for row in cursor.fetchall():
    print(f"ID: {row[0]}, Name: {row[1]}")
conn.close()
