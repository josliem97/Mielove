import sys
import os
import json

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from database import SessionLocal, engine
import models

def seed_template_53():
    db = SessionLocal()
    try:
        # Ensure tables exist
        models.Base.metadata.create_all(bind=engine)
        
        # Clear existing
        try:
            db.query(models.Template).delete()
        except Exception:
            pass
        
        config_master_53 = {
            "canvas": {"width": 575, "height": 11500, "backgroundColor": "#ffffff", "texture": "url('https://www.transparenttextures.com/patterns/handmade-paper.png')", "snapping": True},
            "groom_bank": {"qr": "/images/templates/53/bank_groom.png", "account": "123456789", "name": "{{groom_name}}", "bank": "MB Bank"},
            "bride_bank": {"qr": "/images/templates/53/bank_bride.png", "account": "987654321", "name": "{{bride_name}}", "bank": "Techcombank"},
            "components": [
                # 1. HERO SECTION (0-850)
                {
                    "id": "hero_section", "type": "container", "x": 0, "y": 0, "w": 575, "h": 850, "z": 1,
                    "props": {"fill": "#000"},
                    "components": [
                        { "id": "hero_bg", "type": "element_image", "x": 0, "y": 0, "w": 575, "h": 850, "z": 1, "props": {"src": "/images/templates/53/1773995333916-1770739033371-z7522565669715_eece88b42ebab4a5b591cf73c816cf19.webp", "objectFit": "cover"} },
                        { "id": "hero_gradient", "type": "element_shape", "x": 0, "y": 500, "w": 575, "h": 350, "z": 2, "props": {"fill": "linear-gradient(to top, rgba(0,0,0,0.85), transparent)"} },
                        { "id": "hero_deco_leaf", "type": "element_image", "x": -50, "y": -50, "w": 250, "h": 250, "z": 5, "props": {"src": "https://cdn-icons-png.flaticon.com/512/2921/2921313.png", "opacity": 0.2, "rotation": -45} },
                        { "id": "hero_save", "type": "element_text", "x": 0, "y": 620, "w": 575, "h": 80, "z": 3, "props": {"text": "Save our date", "fontSize": 96, "color": "#ffffff", "align": "center", "fontFamily": "'Great Vibes', cursive"} },
                        { "id": "hero_names", "type": "element_text", "x": 0, "y": 740, "w": 575, "h": 40, "z": 3, "props": {"text": "{{groom_name}} - {{bride_name}}", "fontSize": 34, "color": "#ffffff", "align": "center", "fontFamily": "'Playfair Display', serif", "fontWeight": "bold"} },
                        { "id": "hero_date", "type": "element_text", "x": 0, "y": 790, "w": 575, "h": 40, "z": 3, "props": {"text": "31-12-2026", "fontSize": 32, "color": "#ffffff", "align": "center", "fontFamily": "'Playfair Display', serif", "fontWeight": "bold"} }
                    ]
                },
                
                # 2. GROOM PORTRAIT
                {
                    "id": "groom_section", "type": "container", "x": 0, "y": 850, "w": 575, "h": 900, "z": 2,
                    "props": {"fill": "#3a0305"},
                    "components": [
                        { "id": "gr_q1", "type": "element_text", "x": 0, "y": 60, "w": 575, "h": 80, "z": 2, "props": {"text": "WHEN TWO HEARTS\nBEAT AS ONE", "fontSize": 34, "color": "#ffffff", "align": "center", "fontFamily": "'Playfair Display', serif", "fontWeight": "bold"} },
                        { "id": "gr_line", "type": "element_shape", "x": 286, "y": 150, "w": 2, "h": 40, "z": 2, "props": {"fill": "#ffffff"} },
                        { "id": "gr_img", "type": "element_image", "x": 57, "y": 220, "w": 460, "h": 500, "z": 3, "props": {"src": "/images/templates/53/1773995332651-1770736796361-0438933dad2723797a361.webp", "objectFit": "cover", "borderRadius": 24} },
                        { "id": "gr_chure", "type": "element_text", "x": 0, "y": 600, "w": 575, "h": 80, "z": 5, "props": {"text": "Chú rể", "fontSize": 82, "color": "#ffffff", "align": "center", "fontFamily": "'Great Vibes', cursive"} },
                        { "id": "gr_name", "type": "element_text", "x": 0, "y": 680, "w": 575, "h": 40, "z": 5, "props": {"text": "{{groom_name}}", "fontSize": 34, "color": "#ffffff", "align": "center", "fontFamily": "'Playfair Display', serif", "fontWeight": "bold"} },
                        { "id": "gr_deco", "type": "element_text", "x": 0, "y": 740, "w": 575, "h": 60, "z": 2, "props": {"text": "─── ❦ ───", "fontSize": 20, "color": "rgba(255,255,255,0.3)", "align": "center"} }
                    ]
                },

                # 3. BRIDE PORTRAIT
                {
                    "id": "bride_section", "type": "container", "x": 0, "y": 1750, "w": 575, "h": 900, "z": 2,
                    "props": {"fill": "#3a0305"},
                    "components": [
                        { "id": "br_img", "type": "element_image", "x": 57, "y": 20, "w": 460, "h": 720, "z": 3, "props": {"src": "/images/templates/53/1773995332563-1770737114423-1770736625177-7464951118052762810-cropped.webp", "objectFit": "cover", "borderRadius": 24} },
                        { "id": "br_codau", "type": "element_text", "x": 0, "y": 650, "w": 575, "h": 80, "z": 5, "props": {"text": "Cô dâu", "fontSize": 82, "color": "#ffffff", "align": "center", "fontFamily": "'Great Vibes', cursive"} },
                        { "id": "br_name", "type": "element_text", "x": 0, "y": 730, "w": 575, "h": 40, "z": 5, "props": {"text": "{{bride_name}}", "fontSize": 34, "color": "#ffffff", "align": "center", "fontFamily": "'Playfair Display', serif", "fontWeight": "bold"} },
                        { "id": "br_deco", "type": "element_text", "x": 0, "y": 790, "w": 575, "h": 60, "z": 2, "props": {"text": "─── ❦ ───", "fontSize": 20, "color": "rgba(255,255,255,0.3)", "align": "center"} }
                    ]
                },

                # 4. PARENTS & EVENTS
                {
                    "id": "events_section", "type": "container", "x": 0, "y": 2650, "w": 575, "h": 2200, "z": 2,
                    "props": {"fill": "#f8f8f8"},
                    "components": [
                        { "id": "ev_bg_texture", "type": "element_shape", "x": 0, "y": 0, "w": 575, "h": 2200, "z": 1, "props": {"fill": "url('https://www.transparenttextures.com/patterns/silk.png')", "opacity": 0.05} },
                        { "id": "ev_nhatrai", "type": "element_text", "x": 0, "y": 40, "w": 287, "h": 40, "z": 2, "props": {"text": "Nhà trai", "fontSize": 24, "color": "#5a060a", "align": "center", "fontWeight": "bold"} },
                        { "id": "ev_nhagai", "type": "element_text", "x": 287, "y": 40, "w": 287, "h": 40, "z": 2, "props": {"text": "Nhà gái", "fontSize": 24, "color": "#5a060a", "align": "center", "fontWeight": "bold"} },
                        { "id": "ev_nhatrai_names", "type": "element_text", "x": 0, "y": 80, "w": 287, "h": 60, "z": 2, "props": {"text": "Ông: {{groom_father}}\nBà: {{groom_mother}}", "fontSize": 18, "color": "#5a060a", "align": "center"} },
                        { "id": "ev_nhagai_names", "type": "element_text", "x": 287, "y": 80, "w": 287, "h": 60, "z": 2, "props": {"text": "Ông: {{bride_father}}\nBà: {{bride_mother}}", "fontSize": 18, "color": "#5a060a", "align": "center"} },
                        { "id": "ev_logo_text", "type": "element_text", "x": 0, "y": 180, "w": 575, "h": 100, "z": 3, "props": {"text": "Wedding", "fontSize": 82, "color": "#5a060a", "align": "center", "fontFamily": "'Great Vibes', cursive"} },
                        { "id": "ev_names_gr", "type": "element_text", "x": 0, "y": 280, "w": 575, "h": 40, "z": 2, "props": {"text": "{{groom_name}}", "fontSize": 36, "color": "#5a060a", "align": "center", "fontWeight": "bold"} },
                        { "id": "ev_names_and", "type": "element_text", "x": 0, "y": 320, "w": 575, "h": 40, "z": 2, "props": {"text": "&", "fontSize": 48, "color": "#5a060a", "align": "center", "fontFamily": "'Great Vibes', cursive"} },
                        { "id": "ev_names_br", "type": "element_text", "x": 0, "y": 360, "w": 575, "h": 40, "z": 2, "props": {"text": "{{bride_name}}", "fontSize": 36, "color": "#5a060a", "align": "center", "fontWeight": "bold"} },

                        # LỄ THÀNH HÔN
                        { "id": "ev1_btntxt", "type": "element_text", "x": 0, "y": 460, "w": 575, "h": 40, "z": 3, "props": {"text": "LỄ THÀNH HÔN", "fontSize": 24, "color": "#5a060a", "align": "center", "fontWeight": "bold"} },
                        { "id": "ev1_time", "type": "element_text", "x": 0, "y": 520, "w": 240, "h": 60, "z": 2, "props": {"text": "09:00", "fontSize": 56, "color": "#5a060a", "align": "right"} },
                        { "id": "ev1_vl1", "type": "element_shape", "x": 260, "y": 510, "w": 2, "h": 100, "z": 2, "props": {"fill": "#5a060a"} },
                        { "id": "ev1_dstack", "type": "element_text", "x": 260, "y": 515, "w": 55, "h": 100, "z": 2, "props": {"text": "31\n12\n26", "fontSize": 34, "color": "#5a060a", "align": "center", "lineHeight": 1.1} },
                        { "id": "ev1_vl2", "type": "element_shape", "x": 315, "y": 510, "w": 2, "h": 100, "z": 2, "props": {"fill": "#5a060a"} },
                        { "id": "ev1_day", "type": "element_text", "x": 335, "y": 535, "w": 200, "h": 40, "z": 2, "props": {"text": "THỨ NĂM", "fontSize": 32, "color": "#5a060a", "align": "left"} },
                        { "id": "ev1_loc", "type": "element_text", "x": 0, "y": 640, "w": 575, "h": 100, "z": 2, "props": {"text": "TƯ GIA NHÀ TRAI\n{{location}}", "fontSize": 20, "color": "#5a060a", "align": "center", "lineHeight": 1.6} },
                        { "id": "ev1_map", "type": "element_button", "x": 162, "y": 760, "w": 250, "h": 50, "z": 3, "props": {"text": "📍 Xem bản đồ", "action": "map", "style": "outline", "borderRadius": 40} },

                        # LỄ VU QUY
                        { "id": "ev2_btntxt", "type": "element_text", "x": 0, "y": 880, "w": 575, "h": 40, "z": 3, "props": {"text": "LỄ VU QUY", "fontSize": 24, "color": "#5a060a", "align": "center", "fontWeight": "bold"} },
                        { "id": "ev2_time", "type": "element_text", "x": 0, "y": 940, "w": 240, "h": 60, "z": 2, "props": {"text": "09:00", "fontSize": 56, "color": "#5a060a", "align": "right"} },
                        { "id": "ev2_vl1", "type": "element_shape", "x": 260, "y": 930, "w": 2, "h": 100, "z": 2, "props": {"fill": "#5a060a"} },
                        { "id": "ev2_dstack", "type": "element_text", "x": 260, "y": 935, "w": 55, "h": 100, "z": 2, "props": {"text": "31\n12\n26", "fontSize": 34, "color": "#5a060a", "align": "center", "lineHeight": 1.1} },
                        { "id": "ev2_vl2", "type": "element_shape", "x": 315, "y": 930, "w": 2, "h": 100, "z": 2, "props": {"fill": "#5a060a"} },
                        { "id": "ev2_day", "type": "element_text", "x": 335, "y": 955, "w": 200, "h": 40, "z": 2, "props": {"text": "THỨ NĂM", "fontSize": 32, "color": "#5a060a", "align": "left"} },
                        { "id": "ev2_loc", "type": "element_text", "x": 0, "y": 1060, "w": 575, "h": 100, "z": 2, "props": {"text": "TƯ GIA NHÀ GÁI\n{{location}}", "fontSize": 20, "color": "#5a060a", "align": "center", "lineHeight": 1.6} },
                        { "id": "ev2_map", "type": "element_button", "x": 162, "y": 1180, "w": 250, "h": 50, "z": 3, "props": {"text": "📍 Xem bản đồ", "action": "map", "style": "outline", "borderRadius": 40} },
                    ]
                },

                # 5. CALENDAR
                {
                    "id": "calendar_section", "type": "container", "x": 0, "y": 4850, "w": 575, "h": 1000, "z": 2,
                    "props": {"fill": "#f8f8f8"},
                    "components": [
                        { "id": "cal_year", "type": "element_text", "x": 0, "y": 30, "w": 575, "h": 80, "z": 2, "props": {"text": "2026", "fontSize": 82, "color": "#5a060a", "align": "center"} },
                        { "id": "cal_month", "type": "element_text", "x": 0, "y": 100, "w": 575, "h": 80, "z": 3, "props": {"text": "December", "fontSize": 72, "color": "#5a060a", "align": "center", "fontFamily": "'Great Vibes', cursive"} },
                        { "id": "cal_widget", "type": "element_calendar", "x": 37, "y": 200, "w": 500, "h": 460, "z": 4, "props": {"date": "{{wedding_date}}"} }
                    ]
                },

                # 6. TIMELINE (ICON ELEMENTS)
                {
                    "id": "timeline_section", "type": "container", "x": 0, "y": 5850, "w": 575, "h": 1200, "z": 2,
                    "props": {"fill": "#000"},
                    "components": [
                        { "id": "tl_bg_img", "type": "element_image", "x": 0, "y": 0, "w": 575, "h": 1200, "z": 1, "props": {"src": "https://images.unsplash.com/photo-1519741497674-611481863552?w=800", "opacity": 0.4, "objectFit": "cover"} },
                        { "id": "tl_overlay", "type": "element_shape", "x": 0, "y": 0, "w": 575, "h": 1200, "z": 2, "props": {"fill": "linear-gradient(to bottom, rgba(0,0,0,0.9), rgba(90,6,10,0.8), rgba(0,0,0,0.9))"} },
                        { "id": "tl_title", "type": "element_text", "x": 0, "y": 80, "w": 575, "h": 100, "z": 3, "props": {"text": "Wedding Timeline", "fontSize": 72, "color": "#ffffff", "align": "center", "fontFamily": "'Great Vibes', cursive"} },
                        { "id": "tl_widget", "type": "element_timeline", "x": 50, "y": 220, "w": 475, "h": 900, "z": 4, "props": {
                            "items": [
                                {"time": "09:00", "title": "Lễ Thành Hôn", "icon": "ring"},
                                {"time": "11:30", "title": "Đón khách", "icon": "camera"},
                                {"time": "12:00", "title": "Khai tiệc", "icon": "glass"},
                                {"time": "13:30", "title": "Cắt bánh", "icon": "cake"}
                            ]
                        } }
                    ]
                },

                # 7. OUR MEMORY (INDIVIDUAL BLOCKS)
                {
                    "id": "memory_section", "type": "container", "x": 0, "y": 7050, "w": 575, "h": 2200, "z": 2,
                    "props": {"fill": "#ffffff"},
                    "components": [
                        { "id": "mem_title", "type": "element_text", "x": 0, "y": 40, "w": 575, "h": 80, "z": 3, "props": {"text": "Our Memory", "fontSize": 82, "color": "#5a060a", "align": "center", "fontFamily": "'Great Vibes', cursive"} },
                        { "id": "mem_img1", "type": "element_image", "x": 37, "y": 150, "w": 500, "h": 650, "z": 2, "props": {"src": "/images/templates/53/1773995329499-1770736612197-12597987462083336082.webp", "objectFit": "cover", "borderRadius": 16} },
                        { "id": "mem_img2", "type": "element_image", "x": 37, "y": 820, "w": 500, "h": 650, "z": 2, "props": {"src": "/images/templates/53/1773995331427-1770736615624-43637371145067194907.webp", "objectFit": "cover", "borderRadius": 16} },
                        { "id": "mem_img3", "type": "element_image", "x": 37, "y": 1490, "w": 500, "h": 650, "z": 2, "props": {"src": "/images/templates/53/1773995333755-1770738932961-1770736642986-103656611401632917316-cropped.webp", "objectFit": "cover", "borderRadius": 16} },
                        { "id": "mem_deco_bot", "type": "element_text", "x": 0, "y": 2100, "w": 575, "h": 60, "z": 2, "props": {"text": "─── ❦ ───", "fontSize": 24, "color": "#5a060a", "opacity": 0.3, "align": "center"} }
                    ]
                },

                # 8. GUESTBOOK & GIFTS
                {
                    "id": "footer_section", "type": "container", "x": 0, "y": 9250, "w": 575, "h": 2000, "z": 2,
                    "props": {"fill": "#f7f4ed"},
                    "components": [
                        { "id": "wish_widget", "type": "element_wishes", "x": 37, "y": 60, "w": 500, "h": 1100, "z": 2, "props": {"title": "Sổ lưu bút"} },
                        { "id": "gift_title", "type": "element_text", "x": 0, "y": 1180, "w": 575, "h": 40, "z": 3, "props": {"text": "Gửi Quà Mừng Đám Cưới", "fontSize": 28, "color": "#5a060a", "align": "center", "fontWeight": "bold"} },
                        { "id": "gift_btn1", "type": "element_button", "x": 112, "y": 1240, "w": 350, "h": 75, "z": 3, "props": {"text": "🎁 Quà mừng chú rể", "action": "gift", "style": "solid", "borderRadius": 40, "fill": "#5a060a"} },
                        { "id": "gift_btn2", "type": "element_button", "x": 112, "y": 1340, "w": 350, "h": 75, "z": 3, "props": {"text": "🎁 Quà mừng cô dâu", "action": "gift", "style": "solid", "borderRadius": 40, "fill": "#5a060a"} },
                        { "id": "final_deco", "type": "element_image", "x": 187, "y": 1500, "w": 200, "h": 200, "z": 2, "props": {"src": "https://cdn-icons-png.flaticon.com/512/2921/2921313.png", "opacity": 0.1, "rotation": 0} }
                    ]
                }
            ]
        }
        
        template = models.Template(
            id=1,
            name="Thiệp cưới 53 - Master VIP",
            thumbnail_url="/images/templates/53/1773995333916-1770739033371-z7522565669715_eece88b42ebab4a5b591cf73c816cf19.webp",
            music_url="/audio/young_and_beautiful.m4a",
            category="Premium",
            config_data=config_master_53,
            html_content="",
            css_style=""
        )
        
        db.add(template)
        db.commit()
        print("Success! Premium VIP Template 53 Beautified with textures and deco.")
        
    except Exception as e:
        print(f"Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_template_53()
