import sqlite3
import json

# ULTIMATE HI-FI RECONSTRUCTION
NEW_CONFIG = {
    "canvas": {
        "width": 575,
        "height": 11000, 
        "backgroundColor": "#fdf6e3",
        "backgroundImage": "https://www.transparenttextures.com/patterns/handmade-paper.png",
        "texture": "url('https://www.transparenttextures.com/patterns/silk.png')",
        "musicUrl": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
    },
    "components": [
        # --- SECTION: HERO (Top) ---
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

        # --- SECTION: PARENTS INFO ---
        {
            "id": "parents_label_groom",
            "type": "element_text",
            "x": 50, "y": 950, "w": 220, "h": 30, "z": 2,
            "props": { "text": "Nhà trai", "color": "#6d0208", "fontSize": 14, "align": "center", "fontWeight": "bold", "letterSpacing": "0.1em" }
        },
        {
            "id": "parents_names_groom",
            "type": "element_text",
            "x": 50, "y": 985, "w": 220, "h": 60, "z": 2,
            "props": { "text": "Ông: Nguyễn Văn Diệu\nBà: Phạm Kim Khánh", "color": "#1d1d1f", "fontSize": 12, "align": "center", "fontFamily": "Cormorant Garamond", "lineHeight": 1.5 }
        },
        {
            "id": "parents_label_bride",
            "type": "element_text",
            "x": 305, "y": 950, "w": 220, "h": 30, "z": 2,
            "props": { "text": "Nhà gái", "color": "#6d0208", "fontSize": 14, "align": "center", "fontWeight": "bold", "letterSpacing": "0.1em" }
        },
        {
            "id": "parents_names_bride",
            "type": "element_text",
            "x": 305, "y": 985, "w": 220, "h": 60, "z": 2,
            "props": { "text": "Ông: Phạm Văn Đạo\nBà: Nguyễn Thị Hợi", "color": "#1d1d1f", "fontSize": 12, "align": "center", "fontFamily": "Cormorant Garamond", "lineHeight": 1.5 }
        },

        # --- MONOGRAM & LOGO ---
        {
            "id": "monogram_circle",
            "type": "element_shape",
            "x": 237, "y": 1100, "w": 100, "h": 100, "z": 1,
            "props": { "fill": "transparent", "border": "1px solid #6d0208", "borderRadius": 50, "opacity": 0.2 }
        },
        {
            "id": "monogram",
            "type": "element_text",
            "x": 0, "y": 1110, "w": 575, "h": 80, "z": 2,
            "props": { "text": "H T", "color": "#6d0208", "fontSize": 60, "align": "center", "fontFamily": "OpeningScript" }
        },
        {
            "id": "intro_text",
            "type": "element_text",
            "x": 80, "y": 1250, "w": 415, "h": 80, "z": 2,
            "props": { "text": "Trân trọng kính mời Quý Khách tới tham dự bữa tiệc chung vui cùng gia đình chúng tôi!", "color": "#6d0208", "fontSize": 14, "align": "center", "italic": True, "lineHeight": 1.8 }
        },
        {
            "id": "divider_vertical",
            "type": "element_shape",
            "x": 287, "y": 1350, "w": 1, "h": 60, "z": 2,
            "props": { "fill": "#6d0208", "opacity": 0.3 }
        },
        {
            "id": "names_main",
            "type": "element_text",
            "x": 0, "y": 1450, "w": 575, "h": 120, "z": 3,
            "props": { "text": "ANH QUÂN\n&\nTRƯỜNG THẢO TRANG", "color": "#6d0208", "fontSize": 32, "align": "center", "fontWeight": "bold", "letterSpacing": "0.15em", "fontFamily": "Montserrat" }
        },

        # --- EVENT 1: THANH HON ---
        {
            "id": "event_thanhhon",
            "type": "element_event_card",
            "x": 37, "y": 1650, "w": 500, "h": 650, "z": 2,
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
            "id": "divider_dash",
            "type": "element_text",
            "x": 37, "y": 2350, "w": 500, "h": 20, "z": 2,
            "props": { "text": "------------------------------------------------------------", "color": "#6d0208", "align": "center", "opacity": 0.2 }
        },

        # --- EVENT 2: VU QUY ---
        {
            "id": "event_vuquy",
            "type": "element_event_card",
            "x": 37, "y": 2450, "w": 500, "h": 650, "z": 2,
            "props": {
                "title": "LỄ VU QUY",
                "time": "09:00",
                "date": "2026-12-31",
                "weekday": "THỨ NĂM",
                "location": "TƯ GIA NHÀ GÁI",
                "address": "18 Văn Hòa, Hồng Vân, Hà Nội"
            }
        },

        # --- SECTION: JUST MARRIED (ALBUM) ---
        {
            "id": "just_married_img",
            "type": "element_image",
            "x": 0, "y": 3300, "w": 575, "h": 800, "z": 1,
            "props": { "src": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1976", "objectFit": "cover" }
        },

        # --- SECTION: GIFT (BANK) ---
        {
            "id": "gift_title",
            "type": "element_text",
            "x": 0, "y": 4300, "w": 575, "h": 80, "z": 2,
            "props": { "text": "Hộp Quà Hạnh Phúc", "color": "#6d0208", "fontSize": 42, "align": "center", "fontFamily": "OpeningScript" }
        },
        {
            "id": "bank_bride",
            "type": "element_bank",
            "x": 37, "y": 4450, "w": 500, "h": 600, "z": 2,
            "props": { "bank_name": "Techcombank", "bank_account": "190367892345", "bank_account_name": "TRUONG THAO TRANG", "title": "Mừng cưới Cô Dâu", "bank_qr_code": "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=TCB-190367892345" }
        },
        {
            "id": "bank_groom",
            "type": "element_bank",
            "x": 37, "y": 5100, "w": 500, "h": 600, "z": 2,
            "props": { "bank_name": "Vietcombank", "bank_account": "001100412345", "bank_account_name": "NGUYEN ANH QUAN", "title": "Mừng cưới Chú Rể", "bank_qr_code": "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=VCB-001100412345" }
        },

        # --- SECTION: RSVP POPUP ---
        {
            "id": "footer_rsvp",
            "type": "element_button",
            "x": 137, "y": 5900, "w": 300, "h": 70, "z": 3,
            "props": { "text": "Xác nhận tham dự", "action": "rsvp", "style": "solid" }
        },

        # --- SECTION: COUNTDOWN ---
        {
            "id": "countdown_text",
            "type": "element_text",
            "x": 0, "y": 6150, "w": 575, "h": 80, "z": 2,
            "props": { "text": "We'll be sharing a home and a life\ntogether in", "color": "#6d0208", "fontSize": 18, "align": "center", "italic": True, "fontFamily": "Cormorant Garamond" }
        },
        {
            "id": "count_block",
            "type": "element_countdown",
            "x": 37, "y": 6300, "w": 500, "h": 100, "z": 2,
            "props": { "targetDate": "2026-12-31T09:00:00" }
        },

        # --- SECTION: WISHES ---
        {
            "id": "wish_block",
            "type": "element_wishes",
            "x": 37, "y": 6600, "w": 500, "h": 800, "z": 2,
            "props": { "title": "Lời chúc phúc" }
        },

        # --- SECTION: THANK YOU ---
        {
            "id": "thank_you_text",
            "type": "element_text",
            "x": 0, "y": 7600, "w": 575, "h": 100, "z": 2,
            "props": { "text": "Thank You", "color": "#6d0208", "fontSize": 64, "align": "center", "fontFamily": "OpeningScript" }
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
    print("Successfully applied Ultimate HI-FI Design!")

if __name__ == "__main__":
    seed()
