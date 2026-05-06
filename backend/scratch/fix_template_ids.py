import sqlite3
import sys
import json

# Set output encoding to UTF-8
sys.stdout.reconfigure(encoding='utf-8')

conn = sqlite3.connect('backend/mielove.db')
cursor = conn.cursor()

# 1. Update Template ID 1 to be Template 4 (as requested by user)
cursor.execute("UPDATE templates SET name = 'Mẫu thiệp mới - 4' WHERE id = 1")

# 2. Check if there are other templates
cursor.execute("SELECT id, name FROM templates")
templates = cursor.fetchall()
print("Current Templates in DB:")
for t in templates:
    print(f"ID: {t[0]}, Name: {t[1]}")

conn.commit()
conn.close()
