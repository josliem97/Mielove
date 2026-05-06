import sqlite3
import json
from datetime import datetime

# Define the NEW High-Fidelity Design
NEW_CONFIG = {
    "canvas": {
        "width": 575,
        "height": 9500, # Long scrollable canvas
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
            "props": { 
                "text": "Quang Huy & Thảo Uyên", 
                "color": "#6d0208", 
                "fontSize": 48, 
                "align": "center", 
                "fontFamily": "OpeningScript" 
            },
            "animation": { "preset": "miu-baseline", "delay": 500 }
        },
        {
            "id": "hero_date",
            "type": "element_text",
            "x": 0, "y": 780, "w": 575, "h": 40, "z": 3,
            "props": { 
                "text": "09 . 05 . 2026", 
                "color": "#c5a059", 
                "fontSize": 18, 
                "align": "center", 
                "fontFamily": "Montserrat",
                "fontWeight": "bold",
                "letterSpacing": "0.4em"
            },
            "animation": { "preset": "miu-fadeIn", "delay": 1000 }
        },

        # --- SECTION 2: THE COUPLE ---
        {
            "id": "couple_title",
            "type": "element_text",
            "x": 0, "y": 1000, "w": 575, "h": 100, "z": 2,
            "props": { 
                "text": "The Happy Couple", 
                "color": "#6d0208", 
                "fontSize": 42, 
                "align": "center", 
                "fontFamily": "OpeningScript" 
            },
            "animation": { "preset": "miu-baseline" }
        },
        {
            "id": "groom_card",
            "type": "container",
            "x": 50, "y": 1150, "w": 220, "h": 400, "z": 2,
            "props": { "borderRadius": 110, "overflow": "hidden" },
            "components": [
                { "id": "groom_img", "type": "element_image", "x": 0, "y": 0, "w": 220, "h": 320, "props": { "src": "https://images.unsplash.com/photo-1550005814-386817036737?q=80&w=1974" } },
                { "id": "groom_name", "type": "element_text", "x": 0, "y": 330, "w": 220, "h": 40, "props": { "text": "Quang Huy", "align": "center", "color": "#6d0208", "fontSize": 20, "fontFamily": "Cormorant Garamond", "fontWeight": "bold" } }
            ],
            "animation": { "preset": "miu-stagger-fade", "delay": 200 }
        },
        {
            "id": "bride_card",
            "type": "container",
            "x": 305, "y": 1150, "w": 220, "h": 400, "z": 2,
            "props": { "borderRadius": 110, "overflow": "hidden" },
            "components": [
                { "id": "bride_img", "type": "element_image", "x": 0, "y": 0, "w": 220, "h": 320, "props": { "src": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1976" } },
                { "id": "bride_name", "type": "element_text", "x": 0, "y": 330, "w": 220, "h": 40, "props": { "text": "Thảo Uyên", "align": "center", "color": "#6d0208", "fontSize": 20, "fontFamily": "Cormorant Garamond", "fontWeight": "bold" } }
            ],
            "animation": { "preset": "miu-stagger-fade", "delay": 400 }
        },

        # --- SECTION 3: CALENDAR ---
        {
            "id": "cal_title",
            "type": "element_text",
            "x": 0, "y": 1700, "w": 575, "h": 60, "z": 2,
            "props": { "text": "Save Our Date", "align": "center", "color": "#c5a059", "fontSize": 14, "fontFamily": "Montserrat", "fontWeight": "bold", "letterSpacing": "0.3em" }
        },
        {
            "id": "cal_block",
            "type": "element_calendar",
            "x": 37, "y": 1800, "w": 500, "h": 500, "z": 2,
            "props": { "date": "{{wedding_date}}" },
            "animation": { "preset": "miu-zoomIn" }
        },
        {
            "id": "count_block",
            "type": "element_countdown",
            "x": 37, "y": 2350, "w": 500, "h": 150, "z": 2,
            "props": { "targetDate": "{{wedding_date}}" },
            "animation": { "preset": "miu-fadeIn", "delay": 300 }
        },

        # --- SECTION 4: STORY / QUOTE ---
        {
            "id": "story_quote",
            "type": "element_text",
            "x": 50, "y": 2600, "w": 475, "h": 200, "z": 2,
            "props": { 
                "text": "\"True love is a journey without an end.\"", 
                "color": "#6d0208", 
                "fontSize": 32, 
                "align": "center", 
                "fontFamily": "OpeningScript" 
            },
            "animation": { "preset": "miu-drift" }
        },

        # --- SECTION 5: TIMELINE ---
        {
            "id": "time_title",
            "type": "element_text",
            "x": 0, "y": 2900, "w": 575, "h": 100, "z": 2,
            "props": { "text": "Wedding Timeline", "color": "#6d0208", "fontSize": 42, "align": "center", "fontFamily": "OpeningScript" }
        },
        {
            "id": "time_block",
            "type": "element_timeline",
            "x": 37, "y": 3050, "w": 500, "h": 600, "z": 2,
            "props": {
                "items": [
                    { "time": "09:00", "title": "Lễ Thành Hôn", "icon": "ring" },
                    { "time": "11:30", "title": "Đón Khách", "icon": "camera" },
                    { "time": "12:00", "title": "Khai Tiệc", "icon": "glass" },
                    { "time": "14:00", "title": "Kết Thúc", "icon": "heart" }
                ]
            },
            "animation": { "preset": "miu-baseline" }
        },

        # --- SECTION 6: MEMORIES ---
        {
            "id": "mem_title",
            "type": "element_text",
            "x": 0, "y": 3800, "w": 575, "h": 100, "z": 2,
            "props": { "text": "Our Memories", "color": "#6d0208", "fontSize": 42, "align": "center", "fontFamily": "OpeningScript" }
        },
        {
            "id": "mem_img1",
            "type": "element_image",
            "x": 37, "y": 3950, "w": 500, "h": 700, "z": 2,
            "props": { "src": "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=2069", "borderRadius": 20 },
            "animation": { "preset": "miu-zoomIn" }
        },
        {
            "id": "mem_img2",
            "type": "element_image",
            "x": 37, "y": 4700, "w": 500, "h": 700, "z": 2,
            "props": { "src": "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2070", "borderRadius": 20 },
            "animation": { "preset": "miu-zoomIn" }
        },

        # --- SECTION 7: LOCATION ---
        {
            "id": "loc_title",
            "type": "element_text",
            "x": 0, "y": 5600, "w": 575, "h": 80, "z": 2,
            "props": { "text": "Wedding Location", "color": "#6d0208", "fontSize": 42, "align": "center", "fontFamily": "OpeningScript" }
        },
        {
            "id": "map_block",
            "type": "element_map",
            "x": 37, "y": 5700, "w": 500, "h": 400, "z": 2,
            "props": { "url": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.924403936355!2d105.8164543!3d21.0357106!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab0d127a01e7%3A0xabed7c36b11bc638!2zVmluaG9tZXMgTWV0cm9wb2xpcw!5e0!3m2!1svi!2s!4v1713580000000!5m2!1svi!2s" },
            "animation": { "preset": "miu-fadeIn" }
        },
        {
            "id": "map_btn",
            "type": "element_button",
            "x": 137, "y": 6150, "w": 300, "h": 60, "z": 2,
            "props": { "text": "Chỉ đường Google Maps", "action": "map", "style": "solid" }
        },

        # --- SECTION 8: GIFT ---
        {
            "id": "gift_title",
            "type": "element_text",
            "x": 0, "y": 6400, "w": 575, "h": 80, "z": 2,
            "props": { "text": "Wedding Gift", "color": "#6d0208", "fontSize": 42, "align": "center", "fontFamily": "OpeningScript" }
        },
        {
            "id": "gift_intro",
            "type": "element_text",
            "x": 50, "y": 6500, "w": 475, "h": 60, "z": 2,
            "props": { "text": "Sự hiện diện của bạn là niềm hạnh phúc nhất của chúng tôi. Nếu bạn muốn gửi quà mừng:", "color": "#666", "fontSize": 14, "align": "center", "fontFamily": "Cormorant Garamond" }
        },
        {
            "id": "bank_bride",
            "type": "element_bank",
            "x": 37, "y": 6600, "w": 500, "h": 600, "z": 2,
            "props": { "name": "Nguyễn Thảo Uyên", "account": "1234567890", "bank": "Vietcombank", "qr": "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=VCB-1234567890" }
        },
        {
            "id": "bank_groom",
            "type": "element_bank",
            "x": 37, "y": 7250, "w": 500, "h": 600, "z": 2,
            "props": { "name": "Trần Quang Huy", "account": "0987654321", "bank": "Techcombank", "qr": "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=TCB-0987654321" }
        },

        # --- SECTION 9: WISHES ---
        {
            "id": "wish_block",
            "type": "element_wishes",
            "x": 37, "y": 8000, "w": 500, "h": 800, "z": 2,
            "props": { "title": "Lời chúc phúc" }
        },

        # --- SECTION 10: CLOSING ---
        {
            "id": "closing_text",
            "type": "element_text",
            "x": 0, "y": 9000, "w": 575, "h": 100, "z": 2,
            "props": { "text": "Thank You", "color": "#6d0208", "fontSize": 64, "align": "center", "fontFamily": "OpeningScript" }
        },
        {
            "id": "footer_rsvp",
            "type": "element_button",
            "x": 137, "y": 9150, "w": 300, "h": 70, "z": 3,
            "props": { "text": "Xác nhận tham dự", "action": "rsvp", "style": "solid" },
            "animation": { "preset": "miu-zoomIn", "loop": True, "duration": 2000 }
        }
    ]
}

def seed():
    conn = sqlite3.connect('backend/mielove.db')
    cursor = conn.cursor()
    
    # Update the master template
    cursor.execute("UPDATE templates SET config_data = ? WHERE id = 53", (json.dumps(NEW_CONFIG),))
    
    # Force update the specific wedding
    cursor.execute("UPDATE weddings SET config_data = ? WHERE slug = 'quang-huy-thao-uyen-2026-05-09'", (json.dumps(NEW_CONFIG),))
    
    conn.commit()
    conn.close()
    print("Successfully redesigned Template 53 and synced wedding!")

if __name__ == "__main__":
    seed()
