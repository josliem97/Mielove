import sys
import os

# Add main backend dir to path so we can import modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database import SessionLocal
import models

def reset_templates():
    db = SessionLocal()
    try:
        # 1. Clear all existing templates
        db.query(models.Template).delete()
        
        # 2. Define the ultra-premium Recursive Template 53
        # Translated from the miuwedding HTML reference:
        config_master_53 = {
            "canvas": {"width": 575, "height": 7800, "backgroundColor": "#F9F8F6", "texture": "none"},
            "components": [
                {
                    "id": "master_hero_container",
                    "type": "container",
                    "x": 0, "y": 0, "w": 575, "h": 900, "z": 1,
                    "props": {"fill": "transparent", "overflow": "hidden"},
                    "components": [
                        {
                            "id": "hero_bg",
                            "type": "element_image",
                            "x": -30, "y": -30, "w": 635, "h": 960, "z": 1,
                            "props": {"src": "https://images.unsplash.com/photo-1546032996-6dfacbacba38?w=1200", "objectFit": "cover"},
                            "animation": {"preset": "miu-zoomIn", "duration": 8000}
                        },
                        {
                            "id": "hero_overlay",
                            "type": "element_shape",
                            "x": 0, "y": 0, "w": 575, "h": 900, "z": 2,
                            "props": {"fill": "linear-gradient(to bottom, rgba(255,255,255,0.1), rgba(249,248,246,1))"}
                        },
                        {
                            "id": "hero_save_date",
                            "type": "element_text",
                            "x": 50, "y": 150, "w": 475, "h": 60, "z": 3,
                            "props": {"text": "SAVE THE DATE", "fontSize": 14, "color": "#756555", "align": "center", "letterSpacing": 4, "fontFamily": "'SVN Betalisa', sans-serif"},
                            "animation": {"preset": "miu-fadeUp", "delay": 500}
                        },
                        {
                            "id": "hero_names",
                            "type": "element_text",
                            "x": 20, "y": 250, "w": 535, "h": 140, "z": 3,
                            "props": {"text": "{{groom_name}} & {{bride_name}}", "fontSize": 72, "color": "#2a221b", "align": "center", "lineHeight": 1.1, "fontFamily": "Alisheia"},
                            "animation": {"preset": "miu-fadeUp", "delay": 800}
                        },
                        {
                            "id": "hero_date",
                            "type": "element_text",
                            "x": 50, "y": 420, "w": 475, "h": 60, "z": 3,
                            "props": {"text": "{{wedding_date}}", "fontSize": 20, "color": "#756555", "align": "center", "letterSpacing": 6, "fontFamily": "'Flavinda', serif"},
                            "animation": {"preset": "miu-fadeUp", "delay": 1100}
                        }
                    ]
                },
                {
                    "id": "master_invite_section",
                    "type": "container",
                    "x": 0, "y": 900, "w": 575, "h": 1200, "z": 2,
                    "props": {"fill": "#F9F8F6"},
                    "components": [
                        {
                            "id": "invite_text_intro",
                            "type": "element_text",
                            "x": 50, "y": 100, "w": 475, "h": 180, "z": 1,
                            "props": {"text": "Tình yêu là khi hai tâm hồn cùng nhìn về một hướng. Trân trọng kính mời bạn và người thân đến tham dự ngày chung đôi của chúng mình.", "fontSize": 22, "color": "#4a4036", "align": "center", "lineHeight": 1.6, "fontFamily": "'Ergisa-Regular', serif"},
                            "animation": {"preset": "miu-fadeUp"}
                        },
                        {
                            "id": "invite_event_card",
                            "type": "container",
                            "x": 37, "y": 350, "w": 500, "h": 400, "z": 2,
                            "props": {"fill": "#ffffff", "borderRadius": 24},
                            "style": {"boxShadow": "0 20px 40px rgba(0,0,0,0.04)", "border": "1px solid rgba(0,0,0,0.05)"},
                            "animation": {"preset": "miu-fadeUp"},
                            "components": [
                                {
                                    "id": "invite_card_title",
                                    "type": "element_text",
                                    "x": 0, "y": 40, "w": 500, "h": 50, "z": 1,
                                    "props": {"text": "LỄ THÀNH HÔN", "fontSize": 24, "color": "#d4a373", "align": "center", "fontFamily": "'SVN Betalisa', sans-serif"}
                                },
                                {
                                    "id": "invite_card_time",
                                    "type": "element_text",
                                    "x": 0, "y": 120, "w": 500, "h": 50, "z": 1,
                                    "props": {"text": "{{wedding_time}}", "fontSize": 36, "color": "#2a221b", "align": "center", "fontFamily": "Flavinda"}
                                },
                                {
                                    "id": "invite_card_loc",
                                    "type": "element_text",
                                    "x": 50, "y": 200, "w": 400, "h": 80, "z": 1,
                                    "props": {"text": "{{location}}", "fontSize": 15, "color": "#756555", "align": "center", "lineHeight": 1.4, "fontFamily": "'Inter', sans-serif"}
                                },
                                {
                                    "id": "invite_card_btn",
                                    "type": "element_button",
                                    "x": 150, "y": 300, "w": 200, "h": 50, "z": 2,
                                    "props": {"text": "Xem Bản Đồ", "action": "map", "style": "solid"}
                                }
                            ]
                        }
                    ]
                },
                {
                    "id": "master_timeline_section",
                    "type": "container",
                    "x": 0, "y": 2100, "w": 575, "h": 800, "z": 3,
                    "props": {"fill": "#F9F8F6"},
                    "components": [
                        {
                            "id": "tl_title",
                            "type": "element_text",
                            "x": 0, "y": 80, "w": 575, "h": 100, "z": 1,
                            "props": {"text": "Chương trình", "fontSize": 56, "color": "#2a221b", "align": "center", "fontFamily": "Alisheia"},
                            "animation": {"preset": "miu-fadeUp"}
                        },
                        {
                            "id": "tl_main",
                            "type": "element_timeline",
                            "x": 50, "y": 220, "w": 475, "h": 500, "z": 2,
                            "props": {
                                "items": [
                                    {"time": "14:00", "title": "ĐÓN KHÁCH", "icon": "ring"},
                                    {"time": "15:30", "title": "LỄ CƯỚI", "icon": "heart"},
                                    {"time": "16:30", "title": "TIỆC TỐI", "icon": "glass"},
                                    {"time": "18:00", "title": "AFTER PARTY", "icon": "music"}
                                ]
                            },
                            "animation": {"preset": "miu-fadeUp"}
                        }
                    ]
                },
                {
                    "id": "master_album_section",
                    "type": "container",
                    "x": 0, "y": 2900, "w": 575, "h": 600, "z": 3,
                    "props": {"fill": "#ffffff"},
                    "components": [
                        {
                            "id": "al_title",
                            "type": "element_text",
                            "x": 0, "y": 60, "w": 575, "h": 100, "z": 1,
                            "props": {"text": "Album Hình Cưới", "fontSize": 48, "color": "#8b0000", "align": "center", "fontFamily": "Alisheia"},
                            "animation": {"preset": "miu-fadeUp"}
                        },
                        {
                            "id": "al_slider",
                            "type": "element_album",
                            "x": 37, "y": 180, "w": 500, "h": 360, "z": 2,
                            "props": {
                                "images": [
                                    "https://images.unsplash.com/photo-1519741497674-611481863552?w=800",
                                    "https://images.unsplash.com/photo-1546032996-6dfacbacba38?w=800",
                                    "https://images.unsplash.com/photo-1621503923933-7eb681efedb9?w=800"
                                ]
                            },
                            "animation": {"preset": "miu-zoomIn"}
                        }
                    ]
                },
                {
                    "id": "master_rsvp_section",
                    "type": "container",
                    "x": 0, "y": 3500, "w": 575, "h": 800, "z": 4,
                    "props": {"fill": "#F9F8F6"},
                    "components": [
                        {
                            "id": "rsvp_block",
                            "type": "element_rsvp",
                            "x": 37, "y": 100, "w": 500, "h": 400, "z": 1,
                            "style": {"background": "#ffffff", "borderRadius": "24px", "border": "1px solid rgba(0,0,0,0.05)", "boxShadow": "0 20px 40px rgba(0,0,0,0.04)"},
                            "animation": {"preset": "miu-zoomIn"}
                        }
                    ]
                }
            ]
        }
        
        master_template = models.Template(
            name="Thiệp cưới 53 - Master VIP",
            thumbnail_url="https://assets.cinelove.me/uploads/0f767b27-a71b-47a7-9e12-f4992f0c79f7/5e9c5c52-0e58-4ac5-b2fc-6e3e49e7d03f.jpg",
            category="Premium",
            config_data=config_master_53,
            html_content="",
            css_style=""
        )
        
        db.add(master_template)
        db.commit()
        print("Successfully wiped old templates and seeded the single Thiệp cưới 53 Master template.")
        
    except Exception as e:
        print(f"Error during reset: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    reset_templates()
