import sqlite3
import json

# Reverted to Modern Professional Design + Parent Info after Couple Section
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
        # --- SECTION 1: HERO ---
        {
            "id": "hero_bg",
            "type": "element_image",
            "x": 0, "y": 0, "w": 575, "h": 900, "z": 1,
            "props": { "src": "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070", "objectFit": "cover" },
            "animation": { "preset": "miu-fadeIn", "duration": 2000 }
        },
        {
            "id": "hero_overlay",
            "type": "element_shape",
            "x": 0, "y": 600, "w": 575, "h": 300, "z": 2,
            "props": { "fill": "linear-gradient(to bottom, transparent, #fdf6e3)" }
        },
        {
            "id": "hero_names",
            "type": "element_text",
            "x": 0, "y": 650, "w": 575, "h": 150, "z": 3,
            "props": { "text": "Anh Quân & Thảo Trang", "color": "#6d0208", "fontSize": 48, "align": "center", "fontFamily": "OpeningScript" },
            "animation": { "preset": "miu-baseline", "delay": 500 }
        },

        # --- SECTION 2: THE COUPLE ---
        {
            "id": "couple_title",
            "type": "element_text",
            "x": 0, "y": 1000, "w": 575, "h": 100, "z": 2,
            "props": { "text": "The Happy Couple", "color": "#6d0208", "fontSize": 42, "align": "center", "fontFamily": "OpeningScript" }
        },
        {
            "id": "groom_card",
            "type": "container",
            "x": 50, "y": 1150, "w": 220, "h": 400, "z": 2,
            "props": { "borderRadius": 110, "overflow": "hidden" },
            "components": [
                { "id": "groom_img", "type": "element_image", "x": 0, "y": 0, "w": 220, "h": 320, "props": { "src": "https://images.unsplash.com/photo-1550005814-386817036737?q=80&w=1974" } },
                { "id": "groom_name", "type": "element_text", "x": 0, "y": 330, "w": 220, "h": 40, "props": { "text": "Anh Quân", "align": "center", "color": "#6d0208", "fontSize": 20, "fontFamily": "Cormorant Garamond", "fontWeight": "bold" } }
            ],
            "animation": { "preset": "miu-stagger-fade" }
        },
        {
            "id": "bride_card",
            "type": "container",
            "x": 305, "y": 1150, "w": 220, "h": 400, "z": 2,
            "props": { "borderRadius": 110, "overflow": "hidden" },
            "components": [
                { "id": "bride_img", "type": "element_image", "x": 0, "y": 0, "w": 220, "h": 320, "props": { "src": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1976" } },
                { "id": "bride_name", "type": "element_text", "x": 0, "y": 330, "w": 220, "h": 40, "props": { "text": "Thảo Trang", "align": "center", "color": "#6d0208", "fontSize": 20, "fontFamily": "Cormorant Garamond", "fontWeight": "bold" } }
            ],
            "animation": { "preset": "miu-stagger-fade", "delay": 200 }
        },

        # --- SECTION 3: PARENTS INFO (MOVED HERE) ---
        {
            "id": "parents_bg",
            "type": "element_shape",
            "x": 50, "y": 1600, "w": 475, "h": 150, "z": 1,
            "props": { "fill": "rgba(109, 2, 8, 0.03)", "borderRadius": 20 }
        },
        {
            "id": "groom_parents",
            "type": "element_text",
            "x": 60, "y": 1630, "w": 210, "h": 100, "z": 2,
            "props": { "text": "NHÀ TRAI\nÔng: Nguyễn Văn Diệu\nBà: Phạm Kim Khánh", "color": "#1d1d1f", "fontSize": 14, "align": "center", "fontFamily": "Cormorant Garamond", "fontWeight": "bold" }
        },
        {
            "id": "bride_parents",
            "type": "element_text",
            "x": 305, "y": 1630, "w": 210, "h": 100, "z": 2,
            "props": { "text": "NHÀ GÁI\nÔng: Phạm Văn Đạo\nBà: Nguyễn Thị Hợi", "color": "#1d1d1f", "fontSize": 14, "align": "center", "fontFamily": "Cormorant Garamond", "fontWeight": "bold" }
        },

        # --- SECTION 4: CALENDAR ---
        {
            "id": "cal_title",
            "type": "element_text",
            "x": 0, "y": 1850, "w": 575, "h": 60, "z": 2,
            "props": { "text": "Save Our Date", "align": "center", "color": "#c5a059", "fontSize": 14, "fontFamily": "Montserrat", "fontWeight": "bold", "letterSpacing": "0.3em" }
        },
        {
            "id": "cal_block",
            "type": "element_calendar",
            "x": 37, "y": 1950, "w": 500, "h": 500, "z": 2,
            "props": { "date": "2026-12-31" },
            "animation": { "preset": "miu-zoomIn" }
        },
        {
            "id": "count_block",
            "type": "element_countdown",
            "x": 37, "y": 2500, "w": 500, "h": 150, "z": 2,
            "props": { "targetDate": "2026-12-31T09:00:00" }
        },

        # --- SECTION 5: TIMELINE ---
        {
            "id": "time_title",
            "type": "element_text",
            "x": 0, "y": 2800, "w": 575, "h": 100, "z": 2,
            "props": { "text": "Wedding Timeline", "color": "#6d0208", "fontSize": 42, "align": "center", "fontFamily": "OpeningScript" }
        },
        {
            "id": "time_block",
            "type": "element_timeline",
            "x": 37, "y": 2950, "w": 500, "h": 600, "z": 2,
            "props": {
                "items": [
                    { "time": "09:00", "title": "Lễ Thành Hôn", "icon": "ring" },
                    { "time": "11:30", "title": "Đón Khách", "icon": "camera" },
                    { "time": "12:00", "title": "Khai Tiệc", "icon": "glass" },
                    { "time": "14:00", "title": "Kết Thúc", "icon": "heart" }
                ]
            }
        },

        # --- SECTION 6: MEMORIES ---
        {
            "id": "mem_title",
            "type": "element_text",
            "x": 0, "y": 3700, "w": 575, "h": 100, "z": 2,
            "props": { "text": "Our Memories", "color": "#6d0208", "fontSize": 42, "align": "center", "fontFamily": "OpeningScript" }
        },
        {
            "id": "mem_img1",
            "type": "element_image",
            "x": 37, "y": 3850, "w": 500, "h": 700, "z": 2,
            "props": { "src": "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=2069", "borderRadius": 20 }
        },
        {
            "id": "mem_img2",
            "type": "element_image",
            "x": 37, "y": 4600, "w": 500, "h": 700, "z": 2,
            "props": { "src": "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2070", "borderRadius": 20 }
        },

        # --- SECTION 7: LOCATION ---
        {
            "id": "map_block",
            "type": "element_map",
            "x": 37, "y": 5500, "w": 500, "h": 400, "z": 2,
            "props": { "url": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.924403936355!2d105.8164543!3d21.0357106!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab0d127a01e7%3A0xabed7c36b11bc638!2zVmluaG9tZXMgTWV0cm9wb2xpcw!5e0!3m2!1svi!2s!4v1713580000000!5m2!1svi!2s" }
        },

        # --- SECTION 8: BANK ---
        {
            "id": "bank_bride",
            "type": "element_bank",
            "x": 37, "y": 6000, "w": 500, "h": 600, "z": 2,
            "props": { "name": "Trương Thảo Trang", "account": "1234567890", "bank": "Vietcombank", "qr": "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=VCB-1234567890" }
        },

        # --- SECTION 9: WISHES ---
        {
            "id": "wish_block",
            "type": "element_wishes",
            "x": 37, "y": 6700, "w": 500, "h": 800, "z": 2,
            "props": { "title": "Lời chúc phúc" }
        },

        # --- SECTION 10: CLOSING ---
        {
            "id": "footer_rsvp",
            "type": "element_button",
            "x": 137, "y": 7650, "w": 300, "h": 70, "z": 3,
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
    print("Successfully reverted to Modern Design and added Parent Info after couple section!")

if __name__ == "__main__":
    seed()
