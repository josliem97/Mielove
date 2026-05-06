import sqlite3
conn = sqlite3.connect(r'e:\VINFAST\Mielove\backend\mielove.db')
cur = conn.cursor()
cur.execute("SELECT template_id FROM weddings WHERE slug='thanh-son-dieu-nhi-demo'")
row = cur.fetchone()
print(f'Template ID for demo wedding: {row[0] if row else None}')
cur.execute("SELECT id FROM templates WHERE name='Thanh Sơn - Diệu Nhi'")
rows = cur.fetchall()
print(f'Templates with name Thanh Sơn - Diệu Nhi: {rows}')
