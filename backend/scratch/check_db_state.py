import sqlite3

conn = sqlite3.connect('backend/mielove.db')
cursor = conn.cursor()
cursor.execute("SELECT id, wedding_id, guest_name, wish_message FROM guests WHERE wish_message IS NOT NULL")
print("Guests with wishes:")
for row in cursor.fetchall():
    print(row)

cursor.execute("SELECT id, slug, template_id FROM weddings")
print("\nAll weddings:")
for row in cursor.fetchall():
    print(row)
conn.close()
