import sqlite3
import sys

sys.stdout.reconfigure(encoding='utf-8')

conn = sqlite3.connect('backend/mielove.db')
cursor = conn.cursor()

# Get all wedding IDs for Template 1
cursor.execute("SELECT id FROM weddings WHERE template_id = 1")
wedding_ids = [row[0] for row in cursor.fetchall()]

sample_wishes = [
    ("Minh Anh", "Chúc mừng hạnh phúc hai bạn! Chúc hai bạn trăm năm hạnh phúc, đầu bạc răng long."),
    ("Chị Lan", "Hạnh phúc quá! Chúc cô dâu chú rể sớm có quý tử nhé."),
    ("Đức Trọng", "Mãi mãi bên nhau hạnh phúc nhé hai bạn của tôi.")
]

for w_id in wedding_ids:
    # Check if there are already dummy wishes
    cursor.execute("SELECT COUNT(*) FROM guests WHERE wedding_id = ? AND wish_message IS NOT NULL", (w_id,))
    count = cursor.fetchone()[0]
    
    if count == 0:
        for name, message in sample_wishes:
            cursor.execute("""
                INSERT INTO guests (wedding_id, guest_name, status, adult_count, children_count, wish_message, category) 
                VALUES (?, ?, 'attending', 1, 0, ?, 'Bạn bè')
            """, (w_id, name, message))

conn.commit()
conn.close()
print("Successfully seeded sample guests with wishes for all Template 1 weddings!")
