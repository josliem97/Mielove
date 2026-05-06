import sqlite3
conn = sqlite3.connect(r'e:\VINFAST\Mielove\backend\mielove.db')
cur = conn.cursor()
cur.execute("UPDATE templates SET thumbnail_url = '/uploads/69b95065dcc4597893deb84b/1773752594568-1768964174030-615120422_925471073144357_5596178545909683221_n.webp' WHERE id = 12")
conn.commit()
conn.close()
print('DB fixed.')
