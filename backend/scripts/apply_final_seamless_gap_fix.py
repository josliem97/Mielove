import sqlite3
import json
import copy
from datetime import datetime

# MASTER CONFIG
NEW_CONFIG = {
    "canvas": {
        "width": 575,
        "height": 10500, 
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
            "props": { "src": "https://i.postimg.cc/SQPQ4JNb/1773994673929-1770736621058-3579417304942654189.webp", "objectFit": "cover" }
        },
        {
            "id": "hero_overlay",
            "type": "element_shape",
            "x": 0, "y": 400, "w": 575, "h": 500, "z": 2,
            "props": { "fill": "linear-gradient(to bottom, transparent, rgba(0,0,0,0.3), rgba(0,0,0,0.7))" }
        },
        {
            "id": "hero_names",
            "type": "element_text",
            "x": 0, "y": 620, "w": 575, "h": 120, "z": 3,
            "props": { "text": "{{groom_name}} & {{bride_name}}", "color": "#ffffff", "fontSize": 52, "align": "center", "fontFamily": "OpeningScript" }
        },
        {
            "id": "hero_date",
            "type": "element_text",
            "x": 0, "y": 740, "w": 575, "h": 50, "z": 3,
            "props": { "text": "{{wedding_date_dot}}", "color": "#ffffff", "fontSize": 20, "align": "center", "fontWeight": "bold", "letterSpacing": "0.4em" }
        },

        # --- QUOTE 1 ---
        {
            "id": "quote_top",
            "type": "element_quote",
            "x": 37, "y": 950, "w": 500, "h": 250, "z": 2,
            "props": { 
                "text": "Dẫu có phong ba bão táp, bàn tay này vẫn mãi nắm chặt tay em.",
                "author": "Lời hứa trọn đời"
            }
        },

        # --- PARENTS ---
        {
            "id": "parents_names_groom",
            "type": "element_text",
            "x": 50, "y": 1250, "w": 220, "h": 150, "z": 2,
            "props": { "text": "HỌ NHÀ TRAI\nÔng: Nguyễn Văn A\nBà: Trần Thị B", "color": "#6d0208", "fontSize": 15, "align": "center", "fontFamily": "Cormorant Garamond", "fontWeight": "bold", "lineHeight": 1.6 }
        },
        {
            "id": "parents_names_bride",
            "type": "element_text",
            "x": 305, "y": 1250, "w": 220, "h": 150, "z": 2,
            "props": { "text": "HỌ NHÀ GÁI\nÔng: Phạm Văn C\nBà: Lê Thị D", "color": "#6d0208", "fontSize": 15, "align": "center", "fontFamily": "Cormorant Garamond", "fontWeight": "bold", "lineHeight": 1.6 }
        },

        # --- EVENTS ---
        {
            "id": "event_thanhhon",
            "type": "element_event_card",
            "x": 37, "y": 1450, "w": 500, "h": 650, "z": 2,
            "props": {
                "title": "LỄ THÀNH HÔN",
                "time": "11:00",
                "date": "{{wedding_date}}",
                "weekday": "CHỦ NHẬT",
                "location": "TRUNG TÂM TIỆC CƯỚI",
                "address": "Số 1 Hùng Vương, Ba Đình, Hà Nội"
            }
        },
        {
            "id": "event_vuquy",
            "type": "element_event_card",
            "x": 37, "y": 2150, "w": 500, "h": 650, "z": 2,
            "props": {
                "title": "LỄ VU QUY",
                "time": "09:00",
                "date": "{{wedding_date}}",
                "weekday": "CHỦ NHẬT",
                "location": "TƯ GIA NHÀ GÁI",
                "address": "Số 10 Lý Thường Kiệt, Hoàn Kiếm, Hà Nội"
            }
        },

        # --- CALENDAR ---
        {
            "id": "cal_block",
            "type": "element_calendar",
            "x": 37, "y": 2900, "w": 500, "h": 700, "z": 2,
            "props": { "date": "{{wedding_date}}" }
        },

        # --- GALLERY TITLE ---
        {
            "id": "album_title",
            "type": "element_text",
            "x": 0, "y": 3700, "w": 575, "h": 80, "z": 2,
            "props": { "text": "Khoảnh khắc hạnh phúc", "color": "#6d0208", "fontSize": 48, "align": "center", "fontFamily": "OpeningScript" }
        },

        # --- INDIVIDUAL ALBUM IMAGES ---
        {
            "id": "album_img_0",
            "type": "element_image",
            "x": 37, "y": 3850, "w": 328, "h": 316, "z": 2,
            "props": { "src": "https://i.postimg.cc/SQPQ4JNb/1773994673929-1770736621058-3579417304942654189.webp", "objectFit": "cover", "borderRadius": 20 }
        },
        {
            "id": "album_img_1",
            "type": "element_image",
            "x": 381, "y": 3850, "w": 156, "h": 150, "z": 2,
            "props": { "src": "https://i.postimg.cc/Y2P27hqw/1773995330402-1770736611730-24798835363128034175.webp", "objectFit": "cover", "borderRadius": 20 }
        },
        {
            "id": "album_img_2",
            "type": "element_image",
            "x": 381, "y": 4016, "w": 156, "h": 150, "z": 2,
            "props": { "src": "https://i.postimg.cc/L6Z982nW/1773995331466-1770736620291-9839401570876526296.webp", "objectFit": "cover", "borderRadius": 20 }
        },
        {
            "id": "album_img_3",
            "type": "element_image",
            "x": 37, "y": 4182, "w": 156, "h": 316, "z": 2,
            "props": { "src": "https://i.postimg.cc/y84VJtZr/1773995332083-1770736635898-188121750044876314.webp", "objectFit": "cover", "borderRadius": 20 }
        },
        {
            "id": "album_img_4",
            "type": "element_image",
            "x": 209, "y": 4182, "w": 156, "h": 150, "z": 2,
            "props": { "src": "https://i.postimg.cc/6pJ97gvg/1773995332651-1770736796361-0438933dad2723797a361.webp", "objectFit": "cover", "borderRadius": 20 }
        },
        {
            "id": "album_img_5",
            "type": "element_image",
            "x": 209, "y": 4348, "w": 328, "h": 150, "z": 2,
            "props": { "src": "https://i.postimg.cc/NjqgySXY/1773995333152-1770737476200-1770736593861-28018999421651023-cropped.webp", "objectFit": "cover", "borderRadius": 20 }
        },
        {
            "id": "album_img_6",
            "type": "element_image",
            "x": 37, "y": 4514, "w": 156, "h": 316, "z": 2,
            "props": { "src": "https://i.postimg.cc/NjqgySXF/1773995333916-1770739033371-z7522565669715-eece88b42ebab4a5b591cf73c816cf19.webp", "objectFit": "cover", "borderRadius": 20 }
        },
        {
            "id": "album_img_7",
            "type": "element_image",
            "x": 209, "y": 4514, "w": 156, "h": 150, "z": 2,
            "props": { "src": "https://i.postimg.cc/htWSJ6mf/1773996179189-A-nh-ma-n-hi-nh-2026-03-20-lu-c-15-38-51.webp", "objectFit": "cover", "borderRadius": 20 }
        },
        {
            "id": "album_img_8",
            "type": "element_image",
            "x": 381, "y": 4514, "w": 156, "h": 150, "z": 2,
            "props": { "src": "https://i.postimg.cc/6prBCcVK/1773995334545-1770739359366-1770736625776-28301541887741148248-cropped.webp", "objectFit": "cover", "borderRadius": 20 }
        },
        {
            "id": "album_img_9",
            "type": "element_image",
            "x": 381, "y": 4680, "w": 156, "h": 316, "z": 2,
            "props": { "src": "https://i.postimg.cc/nhbHsgmM/1773995334484-1770739424027-1770739033427-z7522565685280-9c96c2e96fb01ef5962273a11143bdc4-cropped.webp", "objectFit": "cover", "borderRadius": 20 }
        },
        {
            "id": "album_img_10",
            "type": "element_image",
            "x": 37, "y": 4846, "w": 328, "h": 150, "z": 2,
            "props": { "src": "https://i.postimg.cc/SQPQ4JNb/1773994673929-1770736621058-3579417304942654189.webp", "objectFit": "cover", "borderRadius": 20 }
        },
        {
            "id": "album_img_11",
            "type": "element_image",
            "x": 209, "y": 4680, "w": 156, "h": 150, "z": 2,
            "props": { "src": "https://i.postimg.cc/Y2P27hqw/1773995330402-1770736611730-24798835363128034175.webp", "objectFit": "cover", "borderRadius": 20 }
        },

        # --- QUOTE 2 ---
        {
            "id": "quote_bottom",
            "type": "element_quote",
            "x": 37, "y": 5100, "w": 500, "h": 300, "z": 2,
            "props": { 
                "text": "Chúng ta không chỉ kết hôn với người mà chúng ta có thể sống cùng, chúng ta kết hôn với người mà chúng ta không thể sống thiếu.",
                "author": "Khuyết danh"
            }
        },

        # --- DRESSCODE ---
        {
            "id": "dc_block",
            "type": "element_dresscode",
            "x": 37, "y": 5550, "w": 500, "h": 400, "z": 2,
            "props": { "colors": ["#fdecd8", "#6d0208", "#ffffff"] }
        },

        # --- WISHES ---
        {
            "id": "wish_block",
            "type": "element_wishes",
            "x": 37, "y": 6100, "w": 500, "h": 850, "z": 2,
            "props": { "title": "Gửi lời chúc phúc" }
        },

        # --- MAP ---
        {
            "id": "map_block",
            "type": "element_map",
            "x": 37, "y": 7100, "w": 500, "h": 650, "z": 2,
            "props": { "url": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.924403936355!2d105.8164543!3d21.0357106!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab0d127a01e7%3A0xabed7c36b11bc638!2zVmluaG9tZXMgTWV0cm9wb2xpcw!5e0!3m2!1svi!2s!4v1713580000000!5m2!1svi!2s" }
        },

        # --- DUAL BANKS ---
        {
            "id": "bank_groom",
            "type": "element_bank",
            "x": 37, "y": 7900, "w": 500, "h": 850, "z": 2,
            "props": { 
                "title": "Mừng cưới Chú Rể",
                "bank_account_name": "{{groom_name}}", 
                "bank_account": "1234567890", 
                "bank_name": "MB BANK", 
                "bank_qr_code": "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=MB-1234567890" 
            }
        },
        {
            "id": "bank_bride",
            "type": "element_bank",
            "x": 37, "y": 8850, "w": 500, "h": 850, "z": 2,
            "props": { 
                "title": "Mừng cưới Cô Dâu",
                "bank_account_name": "{{bride_name}}", 
                "bank_account": "0987654321", 
                "bank_name": "TECHCOMBANK", 
                "bank_qr_code": "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=TCB-0987654321" 
            }
        },

        # --- FOOTER ---
        {
            "id": "footer_rsvp",
            "type": "element_button",
            "x": 137, "y": 9850, "w": 300, "h": 80, "z": 3,
            "props": { "text": "Xác nhận tham dự", "action": "rsvp", "style": "solid" }
        }
    ]
}

def replace_placeholders(obj, data_map):
    if isinstance(obj, dict):
        return {k: replace_placeholders(v, data_map) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [replace_placeholders(v, data_map) for v in obj]
    elif isinstance(obj, str):
        for key, val in data_map.items():
            if val is not None:
                obj = obj.replace(f"{{{{{key}}}}}", str(val))
        return obj
    return obj

def seed():
    conn = sqlite3.connect('backend/mielove.db')
    cursor = conn.cursor()
    
    # 1. Update master template
    cursor.execute("UPDATE templates SET config_data = ? WHERE id = 1", (json.dumps(NEW_CONFIG),))
    
    # 2. Update existing weddings but PROCESS placeholders
    cursor.execute("SELECT id, groom_name, bride_name, wedding_date FROM weddings WHERE template_id = 1")
    weddings = cursor.fetchall()
    
    for w_id, g_name, b_name, w_date in weddings:
        d_iso = w_date.split('T')[0] if (w_date and 'T' in w_date) else w_date
        d_obj = None
        if d_iso:
            try: d_obj = datetime.strptime(d_iso, '%Y-%m-%d')
            except: pass
        
        dot_date = d_obj.strftime('%d . %m . %Y') if d_obj else (d_iso or "31 . 12 . 2026")
        display_date = d_obj.strftime('%d/%m/%Y') if d_obj else (d_iso or "31/12/2026")
        
        data_map = {
            "groom_name": g_name or "Chú Rể",
            "bride_name": b_name or "Cô Dâu",
            "wedding_date": d_iso or "2026-12-31",
            "wedding_date_dot": dot_date,
            "wedding_date_display": display_date
        }
        
        processed_config = replace_placeholders(copy.deepcopy(NEW_CONFIG), data_map)
        cursor.execute("UPDATE weddings SET config_data = ? WHERE id = ?", (json.dumps(processed_config), w_id))

    conn.commit()
    conn.close()
    print("Successfully applied processed Master Template to all weddings!")

if __name__ == "__main__":
    seed()
