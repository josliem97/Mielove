import sqlite3
import sys

sys.stdout.reconfigure(encoding='utf-8')

conn = sqlite3.connect('backend/mielove.db')
cursor = conn.cursor()

# 1. Check schema
cursor.execute("PRAGMA table_info(wishes)")
columns = cursor.fetchall()
print("Wishes columns:", columns)

# 2. Get all wedding IDs for Template 1
cursor.execute("SELECT id FROM weddings WHERE template_id = 1")
wedding_ids = [row[0] for row in cursor.fetchall()]

# 3. Seed sample wishes
sample_wishes = [
    ("Minh Anh", "Chúc mừng hạnh phúc hai bạn! Chúc hai bạn trăm năm hạnh phúc, đầu bạc răng long."),
    ("Chị Lan", "Hạnh phúc quá! Chúc cô dâu chú rể sớm có quý tử nhé."),
    ("Đức Trọng", "Mãi mãi bên nhau hạnh phúc nhé hai bạn của tôi.")
]

for w_id in wedding_ids:
    # Clear existing wishes to avoid duplicates for the demo
    cursor.execute("DELETE FROM wishes WHERE wedding_id = ?", (w_id,))
    for name, content in sample_wishes:
        cursor.execute("INSERT INTO wishes (wedding_id, name, content) VALUES (?, ?, ?)", (w_id, name, content))

conn.commit()
conn.close()
print("Successfully seeded sample wishes for all weddings!")
