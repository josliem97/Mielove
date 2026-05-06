import sqlite3
import json

# HI-FI RECONSTRUCTION OF TEMPLATE 53 BASED ON USER IMAGES
NEW_CONFIG = {
    "canvas": {
        "width": 575,
        "height": 10000, 
        "backgroundColor": "#fdf6e3",
        "backgroundImage": "https://www.transparenttextures.com/patterns/handmade-paper.png",
        "texture": "url('https://www.transparenttextures.com/patterns/silk.png')",
        "musicUrl": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
    },
    "components": [
        # --- SECTION: PARENTS INFO (Top) ---
        {
            "id": "parents_label_groom",
            "type": "element_text",
            "x": 50, "y": 40, "w": 220, "h": 30, "z": 2,
            "props": { "text": "Nhà trai", "color": "#6d0208", "fontSize": 14, "align": "center", "fontWeight": "bold" }
        },
        {
            "id": "parents_names_groom",
            "type": "element_text",
            "x": 50, "y": 70, "w": 220, "h": 60, "z": 2,
            "props": { "text": "Ông: Nguyễn Văn Diệu\nBà: Phạm Kim Khánh", "color": "#1d1d1f", "fontSize": 12, "align": "center", "fontFamily": "Cormorant Garamond" }
        },
        {
            "id": "parents_label_bride",
            "type": "element_text",
            "x": 305, "y": 40, "w": 220, "h": 30, "z": 2,
            "props": { "text": "Nhà gái", "color": "#6d0208", "fontSize": 14, "align": "center", "fontWeight": "bold" }
        },
        {
            "id": "parents_names_bride",
            "type": "element_text",
            "x": 305, "y": 70, "w": 220, "h": 60, "z": 2,
            "props": { "text": "Ông: Phạm Văn Đạo\nBà: Nguyễn Thị Hợi", "color": "#1d1d1f", "fontSize": 12, "align": "center", "fontFamily": "Cormorant Garamond" }
        },

        # --- LOGO & INTRO ---
        {
            "id": "monogram",
            "type": "element_text",
            "x": 0, "y": 180, "w": 575, "h": 150, "z": 2,
            "props": { "text": "H T", "color": "#6d0208", "fontSize": 80, "align": "center", "fontFamily": "OpeningScript" }
        },
        {
            "id": "intro_text",
            "type": "element_text",
            "x": 80, "y": 380, "w": 415, "h": 100, "z": 2,
            "props": { "text": "Trân trọng kính mời Quý Khách tới tham dự bữa tiệc chung vui cùng gia đình chúng tôi!", "color": "#6d0208", "fontSize": 14, "align": "center", "italic": True, "lineHeight": 1.6 }
        },
        {
            "id": "divider_vertical",
            "type": "element_shape",
            "x": 287, "y": 500, "w": 1, "h": 80, "z": 2,
            "props": { "fill": "#6d0208" }
        },
        {
            "id": "names_main",
            "type": "element_text",
            "x": 0, "y": 620, "w": 575, "h": 150, "z": 3,
            "props": { "text": "ANH QUÂN\n&\nTRƯỜNG THẢO TRANG", "color": "#6d0208", "fontSize": 28, "align": "center", "fontWeight": "bold", "letterSpacing": "0.1em" }
        },

        # --- EVENT 1: THANH HON ---
        {
            "id": "event_thanhhon",
            "type": "element_event_card",
            "x": 37, "y": 850, "w": 500, "h": 600, "z": 2,
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
            "x": 37, "y": 1500, "w": 500, "h": 20, "z": 2,
            "props": { "text": "------------------------------------------------------------", "color": "#6d0208", "align": "center", "opacity": 0.3 }
        },

        # --- EVENT 2: VU QUY ---
        {
            "id": "event_vuquy",
            "type": "element_event_card",
            "x": 37, "y": 1600, "w": 500, "h": 600, "z": 2,
            "props": {
                "title": "LỄ VU QUY",
                "time": "09:00",
                "date": "2026-12-31",
                "weekday": "THỨ NĂM",
                "location": "TƯ GIA NHÀ GÁI",
                "address": "18 Văn Hòa, Hồng Vân, Hà Nội"
            }
        },

        # --- SECTION: JUST MARRIED (IMAGE 2) ---
        {
            "id": "just_married_img",
            "type": "element_image",
            "x": 0, "y": 2400, "w": 575, "h": 800, "z": 1,
            "props": { "src": "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070", "objectFit": "cover" }
        },
        {
            "id": "cal_block",
            "type": "element_calendar",
            "x": 37, "y": 3300, "w": 500, "h": 600, "z": 2,
            "props": { "date": "2026-12-31" }
        },
        {
            "id": "countdown_text",
            "type": "element_text",
            "x": 0, "y": 4000, "w": 575, "h": 100, "z": 2,
            "props": { "text": "We'll be sharing a home and a life\ntogether in", "color": "#6d0208", "fontSize": 16, "align": "center", "italic": True }
        },
        {
            "id": "count_block",
            "type": "element_countdown",
            "x": 37, "y": 4150, "w": 500, "h": 100, "z": 2,
            "props": { "targetDate": "2026-12-31T09:00:00" }
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
    print("Successfully applied HI-FI Design matching user images!")

if __name__ == "__main__":
    seed()
