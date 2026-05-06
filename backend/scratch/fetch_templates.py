import sqlite3

conn = sqlite3.connect(r'e:\VINFAST\Mielove\backend\mielove.db')
cur = conn.cursor()
cur.execute('SELECT id, name, thumbnail_url FROM templates')
with open('backend/scratch/templates_list.txt', 'w', encoding='utf-8') as f:
    for row in cur.fetchall():
        f.write(f"ID={row[0]} Name='{row[1]}' Thumb='{row[2]}'\n")
conn.close()
