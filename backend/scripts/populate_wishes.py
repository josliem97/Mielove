import sqlite3
import datetime

db_path = 'e:/VINFAST/Mielove/backend/mielove.db'
conn = sqlite3.connect(db_path)
cur = conn.cursor()

# Get the wedding ID for the slug pham-liem-tra-my-2026-04-25
cur.execute('SELECT id FROM weddings WHERE slug="pham-liem-tra-my-2026-04-25"')
res = cur.fetchone()
if res:
    wedding_id = res[0]
    
    # Delete existing guests for this wedding to start fresh
    cur.execute('DELETE FROM guests WHERE wedding_id=?', (wedding_id,))
    
    # Add dummy wishes
    wishes = [
        ("Nguyễn Văn An", "Chúc mừng hạnh phúc hai bạn! Chúc hai bạn trăm năm hạnh phúc, sớm có quý tử nhé!"),
        ("Trần Thị Bình", "Đám cưới tuyệt vời quá! Chúc cô dâu chú rể luôn yêu thương nhau như ngày đầu tiên."),
        ("Lê Hoàng Nam", "Tiếc quá mình không đi được, nhưng xin gửi lời chúc phúc chân thành nhất tới hai bạn."),
        ("Phạm Thanh Thảo", "Mãi hạnh phúc nhé hai bạn yêu của mình! Chúc mừng tân gia luôn nha haha."),
        ("Vũ Đức Thịnh", "Chúc hai bạn trăm năm tình viên mãn, bạc đầu nghĩa phu thê.")
    ]
    
    for name, msg in wishes:
        cur.execute('''
            INSERT INTO guests (wedding_id, guest_name, custom_slug, status, wish_message, created_at)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (wedding_id, name, name.lower().replace(' ', '-'), 'attending', msg, datetime.datetime.now()))
        
    print(f"Populated {len(wishes)} sample wishes for wedding ID {wedding_id}")

conn.commit()
conn.close()
