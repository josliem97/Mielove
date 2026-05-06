import sqlite3
import json

# FINAL BALANCE & DUAL BANKS
NEW_CONFIG = {
    "canvas": {
        "width": 575,
        "height": 11500, 
        "backgroundColor": "#fdf6e3",
        "backgroundImage": "https://www.transparenttextures.com/patterns/handmade-paper.png",
        "texture": "url('https://www.transparenttextures.com/patterns/silk.png')",
        "musicUrl": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
    },
    "components": [
        # --- HERO ---
        {
            "id": "hero_bg",
            "type": "element_image",
            "x": 0, "y": 0, "w": 575, "h": 900, "z": 1,
            "props": { "src": "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070", "objectFit": "cover" }
        },
        {
            "id": "hero_overlay",
            "type": "element_shape",
            "x": 0, "y": 500, "w": 575, "h": 400, "z": 2,
            "props": { "fill": "linear-gradient(to bottom, transparent, rgba(253, 246, 227, 0.9), #fdf6e3)" }
        },
        {
            "id": "hero_names",
            "type": "element_text",
            "x": 0, "y": 620, "w": 575, "h": 120, "z": 3,
            "props": { "text": "Anh Quân & Thảo Trang", "color": "#6d0208", "fontSize": 52, "align": "center", "fontFamily": "OpeningScript" }
        },
        {
            "id": "hero_date",
            "type": "element_text",
            "x": 0, "y": 740, "w": 575, "h": 50, "z": 3,
            "props": { "text": "31 . 12 . 2026", "color": "#6d0208", "fontSize": 20, "align": "center", "fontWeight": "bold", "letterSpacing": "0.4em" }
        },

        # --- QUOTE 1 ---
        {
            "id": "quote_top",
            "type": "element_quote",
            "x": 37, "y": 1000, "w": 500, "h": 250, "z": 2,
            "props": { 
                "text": "Tình yêu không phải là nhìn vào nhau, mà là cùng nhau nhìn về một hướng.",
                "author": "Antoine de Saint-Exupéry"
            }
        },

        # --- PARENTS ---
        {
            "id": "parents_names_groom",
            "type": "element_text",
            "x": 50, "y": 1400, "w": 220, "h": 100, "z": 2,
            "props": { "text": "NHÀ TRAI\nÔng: Nguyễn Văn Diệu\nBà: Phạm Kim Khánh", "color": "#6d0208", "fontSize": 14, "align": "center", "fontFamily": "Cormorant Garamond", "fontWeight": "bold", "lineHeight": 1.5 }
        },
        {
            "id": "parents_names_bride",
            "type": "element_text",
            "x": 305, "y": 1400, "w": 220, "h": 100, "z": 2,
            "props": { "text": "NHÀ GÁI\nÔng: Phạm Văn Đạo\nBà: Nguyễn Thị Hợi", "color": "#6d0208", "fontSize": 14, "align": "center", "fontFamily": "Cormorant Garamond", "fontWeight": "bold", "lineHeight": 1.5 }
        },

        # --- EVENTS ---
        {
            "id": "event_thanhhon",
            "type": "element_event_card",
            "x": 37, "y": 1600, "w": 500, "h": 650, "z": 2,
            "props": {
                "title": "LỄ THÀNH HÔN",
                "time": "09:00",
                "date": "2026-12-31",
                "weekday": "THỨ NĂM",
                "location": "TƯ GIA NHÀ TRAI",
                "address": "18 Văn Hòa, Hồng Vân, Hà Nội"
            }
        },
        {
            "id": "event_vuquy",
            "type": "element_event_card",
            "x": 37, "y": 2400, "w": 500, "h": 650, "z": 2,
            "props": {
                "title": "LỄ VU QUY",
                "time": "09:00",
                "date": "2026-12-31",
                "weekday": "THỨ NĂM",
                "location": "TƯ GIA NHÀ GÁI",
                "address": "18 Văn Hòa, Hồng Vân, Hà Nội"
            }
        },

        # --- CALENDAR ---
        {
            "id": "cal_block",
            "type": "element_calendar",
            "x": 37, "y": 3200, "w": 500, "h": 700, "z": 2,
            "props": { "date": "2026-12-31" }
        },

        # --- GALLERY ---
        {
            "id": "album_title",
            "type": "element_text",
            "x": 0, "y": 4100, "w": 575, "h": 80, "z": 2,
            "props": { "text": "Khoảnh khắc yêu thương", "color": "#6d0208", "fontSize": 42, "align": "center", "fontFamily": "OpeningScript" }
        },
        {
            "id": "album_block",
            "type": "element_album",
            "x": 37, "y": 4250, "w": 500, "h": 1500, "z": 2,
            "props": {
                "images": [
                    "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=2069",
                    "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2070",
                    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1976",
                    "https://images.unsplash.com/photo-1550005814-386817036737?q=80&w=1974",
                    "https://images.unsplash.com/photo-1522673607200-1648832cee98?q=80&w=2070",
                    "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070"
                ]
            }
        },

        # --- QUOTE 2 ---
        {
            "id": "quote_bottom",
            "type": "element_quote",
            "x": 37, "y": 5900, "w": 500, "h": 300, "z": 2,
            "props": { 
                "text": "Chúng ta không chỉ kết hôn với người mà chúng ta có thể sống cùng, chúng ta kết hôn với người mà chúng ta không thể sống thiếu.",
                "author": "Khuyết danh"
            }
        },

        # --- DRESSCODE ---
        {
            "id": "dc_block",
            "type": "element_dresscode",
            "x": 37, "y": 6400, "w": 500, "h": 400, "z": 2,
            "props": { "colors": ["#fdecd8", "#6d0208", "#ffffff"] }
        },

        # --- WISHES ---
        {
            "id": "wish_block",
            "type": "element_wishes",
            "x": 37, "y": 7000, "w": 500, "h": 850, "z": 2,
            "props": { "title": "Lời chúc phúc" }
        },

        # --- MAP ---
        {
            "id": "map_block",
            "type": "element_map",
            "x": 37, "y": 8000, "w": 500, "h": 650, "z": 2,
            "props": { "url": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.924403936355!2d105.8164543!3d21.0357106!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab0d127a01e7%3A0xabed7c36b11bc638!2zVmluaG9tZXMgTWV0cm9wb2xpcw!5e0!3m2!1svi!2s!4v1713580000000!5m2!1svi!2s" }
        },

        # --- DUAL BANKS ---
        {
            "id": "bank_groom",
            "type": "element_bank",
            "x": 37, "y": 8800, "w": 500, "h": 800, "z": 2,
            "props": { 
                "title": "Mừng cưới Chú Rể",
                "name": "Nguyễn Anh Quân", 
                "account": "1234567890", 
                "bank": "Vietcombank", 
                "qr": "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=VCB-1234567890" 
            }
        },
        {
            "id": "bank_bride",
            "type": "element_bank",
            "x": 37, "y": 9750, "w": 500, "h": 800, "z": 2,
            "props": { 
                "title": "Mừng cưới Cô Dâu",
                "name": "Trương Thảo Trang", 
                "account": "0987654321", 
                "bank": "Techcombank", 
                "qr": "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=TCB-0987654321" 
            }
        },

        # --- FOOTER ---
        {
            "id": "footer_rsvp",
            "type": "element_button",
            "x": 137, "y": 10700, "w": 300, "h": 70, "z": 3,
            "props": { "text": "Xác nhận tham dự", "action": "rsvp", "style": "solid" }
        }
    ]
}

def seed():
    conn = sqlite3.connect('backend/mielove.db')
    cursor = conn.cursor()
    cursor.execute("UPDATE templates SET config_data = ? WHERE id = 53", (json.dumps(NEW_CONFIG),))
    cursor.execute("UPDATE weddings SET config_data = ? WHERE slug = 'quang-huy-thao-uyen-2026-05-09'", (json.dumps(NEW_CONFIG),))
    conn.commit()
    conn.close()
    print("Successfully applied Balanced Layout & Dual Banks!")

if __name__ == "__main__":
    seed()
