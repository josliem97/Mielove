import sqlite3
import json

# Redesigned Template 53 with User Requirements
NEW_CONFIG = {
    "canvas": {
        "width": 575,
        "height": 10500, # Extended for more sections
        "backgroundColor": "#fdf6e3",
        "backgroundImage": "https://www.transparenttextures.com/patterns/handmade-paper.png",
        "texture": "url('https://www.transparenttextures.com/patterns/silk.png')",
        "musicUrl": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
    },
    "components": [
        # --- SECTION 0: PARENTS INFO (NEW) ---
        {
            "id": "parents_bg",
            "type": "element_shape",
            "x": 0, "y": 0, "w": 575, "h": 200, "z": 1,
            "props": { "fill": "rgba(109, 2, 8, 0.03)" }
        },
        {
            "id": "groom_parents_label",
            "type": "element_text",
            "x": 50, "y": 40, "w": 220, "h": 30, "z": 2,
            "props": { "text": "NHÀ TRAI", "color": "#6d0208", "fontSize": 14, "align": "center", "fontWeight": "bold", "letterSpacing": "0.2em" }
        },
        {
            "id": "groom_parents_names",
            "type": "element_text",
            "x": 50, "y": 70, "w": 220, "h": 80, "z": 2,
            "props": { "text": "Ông: Nguyễn Văn Diệu\nBà: Phạm Kim Khánh", "color": "#1d1d1f", "fontSize": 14, "align": "center", "fontFamily": "Cormorant Garamond", "fontWeight": "bold" }
        },
        {
            "id": "bride_parents_label",
            "type": "element_text",
            "x": 305, "y": 40, "w": 220, "h": 30, "z": 2,
            "props": { "text": "NHÀ GÁI", "color": "#6d0208", "fontSize": 14, "align": "center", "fontWeight": "bold", "letterSpacing": "0.2em" }
        },
        {
            "id": "bride_parents_names",
            "type": "element_text",
            "x": 305, "y": 70, "w": 220, "h": 80, "z": 2,
            "props": { "text": "Ông: Phạm Văn Đạo\nBà: Nguyễn Thị Hợi", "color": "#1d1d1f", "fontSize": 14, "align": "center", "fontFamily": "Cormorant Garamond", "fontWeight": "bold" }
        },

        # --- SECTION 1: HERO ---
        {
            "id": "hero_bg",
            "type": "element_image",
            "x": 37, "y": 250, "w": 500, "h": 750, "z": 1,
            "props": { "src": "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=2069", "borderRadius": 250, "objectFit": "cover" },
            "animation": { "preset": "miu-zoomIn", "duration": 2000 }
        },
        {
            "id": "hero_names",
            "type": "element_text",
            "x": 0, "y": 1050, "w": 575, "h": 120, "z": 3,
            "props": { "text": "Anh Quân & Thảo Trang", "color": "#6d0208", "fontSize": 56, "align": "center", "fontFamily": "OpeningScript" },
            "animation": { "preset": "miu-baseline", "delay": 500 }
        },

        # --- SECTION 2: CALENDAR (UPDATED) ---
        {
            "id": "cal_block",
            "type": "element_calendar",
            "x": 37, "y": 1300, "w": 500, "h": 600, "z": 2,
            "props": { "date": "2026-12-31" },
            "animation": { "preset": "miu-zoomIn" }
        },
        {
            "id": "count_block",
            "type": "element_countdown",
            "x": 37, "y": 1950, "w": 500, "h": 150, "z": 2,
            "props": { "targetDate": "2026-12-31T09:00:00" },
            "animation": { "preset": "miu-fadeIn", "delay": 300 }
        },

        # --- SECTION 3: THE COUPLE ---
        {
            "id": "groom_img",
            "type": "element_image",
            "x": 50, "y": 2200, "w": 220, "h": 320, "z": 2,
            "props": { "src": "https://images.unsplash.com/photo-1550005814-386817036737?q=80&w=1974", "borderRadius": 110, "shadow": True },
            "animation": { "preset": "miu-stagger-fade" }
        },
        {
            "id": "bride_img",
            "type": "element_image",
            "x": 305, "y": 2200, "w": 220, "h": 320, "z": 2,
            "props": { "src": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1976", "borderRadius": 110, "shadow": True },
            "animation": { "preset": "miu-stagger-fade", "delay": 200 }
        },

        # --- SECTION 4: TIMELINE WITH BG ---
        {
            "id": "time_title",
            "type": "element_text",
            "x": 0, "y": 2700, "w": 575, "h": 100, "z": 2,
            "props": { "text": "Wedding Timeline", "color": "#6d0208", "fontSize": 42, "align": "center", "fontFamily": "OpeningScript" }
        },
        {
            "id": "time_block",
            "type": "element_timeline",
            "x": 37, "y": 2850, "w": 500, "h": 700, "z": 2,
            "props": {
                "backgroundImage": "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070",
                "items": [
                    { "time": "09:00", "title": "Lễ Thành Hôn", "icon": "ring" },
                    { "time": "11:30", "title": "Đón Khách", "icon": "camera" },
                    { "time": "12:00", "title": "Khai Tiệc", "icon": "glass" },
                    { "time": "14:00", "title": "Kết Thúc", "icon": "heart" }
                ]
            },
            "animation": { "preset": "miu-baseline" }
        },

        # --- SECTION 5: GALLERY ---
        {
            "id": "mem_img1",
            "type": "element_image",
            "x": 37, "y": 3700, "w": 500, "h": 700, "z": 2,
            "props": { "src": "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=2069", "borderRadius": 40, "shadow": True },
            "animation": { "preset": "miu-zoomIn" }
        },
        {
            "id": "mem_img2",
            "type": "element_image",
            "x": 37, "y": 4450, "w": 500, "h": 700, "z": 2,
            "props": { "src": "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2070", "borderRadius": 40, "shadow": True },
            "animation": { "preset": "miu-zoomIn" }
        },

        # --- SECTION 6: MAP ---
        {
            "id": "map_block",
            "type": "element_map",
            "x": 37, "y": 5300, "w": 500, "h": 400, "z": 2,
            "props": { "url": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.924403936355!2d105.8164543!3d21.0357106!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab0d127a01e7%3A0xabed7c36b11bc638!2zVmluaG9tZXMgTWV0cm9wb2xpcw!5e0!3m2!1svi!2s!4v1713580000000!5m2!1svi!2s" }
        },

        # --- SECTION 7: BANK ---
        {
            "id": "bank_bride",
            "type": "element_bank",
            "x": 37, "y": 5800, "w": 500, "h": 600, "z": 2,
            "props": { "name": "Trương Thảo Trang", "account": "1234567890", "bank": "Vietcombank", "qr": "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=VCB-1234567890" }
        },

        # --- SECTION 8: WISHES ---
        {
            "id": "wish_block",
            "type": "element_wishes",
            "x": 37, "y": 6500, "w": 500, "h": 800, "z": 2,
            "props": { "title": "Lời chúc phúc" }
        },

        # --- SECTION 9: INLINE RSVP (NEW REQUIREMENT) ---
        {
            "id": "rsvp_title",
            "type": "element_text",
            "x": 0, "y": 7400, "w": 575, "h": 80, "z": 2,
            "props": { "text": "Xác nhận tham dự", "color": "#6d0208", "fontSize": 42, "align": "center", "fontFamily": "OpeningScript" }
        },
        {
            "id": "rsvp_inline",
            "type": "element_rsvp_inline",
            "x": 37, "y": 7500, "w": 500, "h": 800, "z": 2
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
    print("Successfully updated Template 53 with Inline RSVP and Parent Info!")

if __name__ == "__main__":
    seed()
