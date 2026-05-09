import json

# Define the Hoa Moc Xanh template config
config = {
    "canvas": {
        "width": 575,
        "height": 9500,
        "backgroundColor": "#fffaf7",
        "texture": "none",
        "snapping": True
    },
    "components": [
        # --- DECORATIONS ---
        {
            "id": "deco-flower-top", "type": "element_image",
            "x": 110, "y": -150, "w": 620, "h": 620, "z": 1, "rotation": -1,
            "props": {"src": "/templates/hoa-moc-xanh/flower.webp", "objectFit": "contain"}
        },
        {
            "id": "deco-bar", "type": "element_image",
            "x": -100, "y": 170, "w": 800, "h": 150, "z": 2,
            "props": {"src": "/templates/hoa-moc-xanh/decoration_bar.webp", "objectFit": "cover"}
        },
        
        # --- HERO NAMES ---
        {
            "id": "groom-title", "type": "element_text",
            "x": 300, "y": 100, "w": 200, "h": 30, "z": 10,
            "props": {"text": "Trưởng Nam", "fontSize": 14, "color": "#464646", "fontFamily": "serif", "align": "left"}
        },
        {
            "id": "groom-name-hero", "type": "element_text",
            "x": 300, "y": 130, "w": 250, "h": 50, "z": 10,
            "props": {"text": "{{groom_name}}", "fontSize": 32, "color": "#30530f", "fontFamily": "serif", "align": "left", "fontWeight": "bold"}
        },
        
        # --- HERO IMAGES (Angled) ---
        {
            "id": "groom-img-hero", "type": "element_image",
            "x": 50, "y": -20, "w": 220, "h": 330, "z": 5, "rotation": -17,
            "props": {"src": "https://cdn.chungdoi.com/uploads/296d082d-c2bf-4510-a9e3-c7bdea13f850.webp", "objectFit": "cover"},
            "style": {"border": "5px solid #b28e72"}
        },
        {
            "id": "bride-img-hero", "type": "element_image",
            "x": 300, "y": 200, "w": 220, "h": 330, "z": 6, "rotation": 13,
            "props": {"src": "https://cdn.chungdoi.com/uploads/0ac5a43c-3c7b-4650-a2de-c64d1d30f5ed.webp", "objectFit": "cover"},
            "style": {"border": "5px solid #b28e72"}
        },
        
        {
            "id": "bride-title", "type": "element_text",
            "x": 50, "y": 380, "w": 200, "h": 30, "z": 10,
            "props": {"text": "Út Nữ", "fontSize": 14, "color": "#464646", "fontFamily": "serif", "align": "right"}
        },
        {
            "id": "bride-name-hero", "type": "element_text",
            "x": 50, "y": 410, "w": 200, "h": 50, "z": 10,
            "props": {"text": "{{bride_name}}", "fontSize": 32, "color": "#30530f", "fontFamily": "serif", "align": "right", "fontWeight": "bold"}
        },

        # --- WEDDING INFO SECTION ---
        {
            "id": "section-title-info", "type": "element_text",
            "x": 0, "y": 700, "w": 575, "h": 50, "z": 10,
            "props": {"text": "THÔNG TIN LỄ CƯỚI", "fontSize": 24, "color": "#30530f", "fontFamily": "serif", "align": "center", "fontWeight": "bold"}
        },
        {
            "id": "parents-info", "type": "element_text",
            "x": 20, "y": 780, "w": 535, "h": 200, "z": 10,
            "props": {
                "text": "Nhà Trai: {{groom_father}} & {{groom_mother}}\nNhà Gái: {{bride_father}} & {{bride_mother}}",
                "fontSize": 18, "color": "#30530f", "fontFamily": "serif", "align": "center"
            }
        },

        # --- NAMES CENTER ---
        {
            "id": "groom-full-name", "type": "element_text",
            "x": 0, "y": 1050, "w": 575, "h": 80, "z": 10,
            "props": {"text": "{{groom_name}}", "fontSize": 54, "color": "#30530f", "fontFamily": "serif", "align": "center"}
        },
        {
            "id": "ampersand", "type": "element_text",
            "x": 0, "y": 1130, "w": 575, "h": 60, "z": 10,
            "props": {"text": "&", "fontSize": 42, "color": "#30530f", "fontFamily": "serif", "align": "center"}
        },
        {
            "id": "bride-full-name", "type": "element_text",
            "x": 0, "y": 1190, "w": 575, "h": 80, "z": 10,
            "props": {"text": "{{bride_name}}", "fontSize": 54, "color": "#30530f", "fontFamily": "serif", "align": "center"}
        },

        # --- CALENDAR & COUNTDOWN ---
        {
            "id": "calendar-widget", "type": "element_calendar",
            "x": 87, "y": 1350, "w": 400, "h": 300, "z": 10,
            "props": {"date": "2026-05-24", "time": "09:00", "label": "LỄ THÀNH HÔN"}
        },
        {
            "id": "countdown-widget", "type": "element_countdown",
            "x": 77, "y": 1680, "w": 420, "h": 100, "z": 10,
            "props": {"targetDate": "2026-05-24T09:00"}
        },

        # --- ALBUM ---
        {
            "id": "album-title", "type": "element_text",
            "x": 0, "y": 2000, "w": 575, "h": 50, "z": 10,
            "props": {"text": "ALBUM ẢNH CƯỚI", "fontSize": 24, "color": "#30530f", "fontFamily": "serif", "align": "center", "fontWeight": "bold"}
        },
        {
            "id": "album-widget", "type": "element_album",
            "x": 37, "y": 2100, "w": 500, "h": 500, "z": 10,
            "props": {}
        },

        # --- TIMELINE ---
        {
            "id": "timeline-title", "type": "element_text",
            "x": 0, "y": 2800, "w": 575, "h": 50, "z": 10,
            "props": {"text": "LỊCH TRÌNH NGÀY CƯỚI", "fontSize": 24, "color": "#30530f", "fontFamily": "serif", "align": "center", "fontWeight": "bold"}
        },
        {
            "id": "timeline-widget", "type": "element_timeline",
            "x": 37, "y": 2900, "w": 500, "h": 600, "z": 10,
            "props": {
                "items": [
                    {"time": "17:30", "title": "Đón khách", "icon": "glass"},
                    {"time": "18:30", "title": "Khai tiệc", "icon": "ring"},
                    {"time": "18:45", "title": "Lễ chính", "icon": "heart"},
                    {"time": "21:00", "title": "Kết thúc", "icon": "cake"}
                ]
            }
        },

        # --- WISHES ---
        {
            "id": "wishes-title", "type": "element_text",
            "x": 0, "y": 3650, "w": 575, "h": 50, "z": 10,
            "props": {"text": "SỔ LƯU BÚT", "fontSize": 24, "color": "#30530f", "fontFamily": "serif", "align": "center", "fontWeight": "bold"}
        },
        {
            "id": "wishes-widget", "type": "element_wishes",
            "x": 37, "y": 3750, "w": 500, "h": 600, "z": 10,
            "props": {}
        },

        # --- BANK ---
        {
            "id": "bank-title", "type": "element_text",
            "x": 0, "y": 4500, "w": 575, "h": 50, "z": 10,
            "props": {"text": "HỘP MỪNG CƯỚI", "fontSize": 24, "color": "#30530f", "fontFamily": "serif", "align": "center", "fontWeight": "bold"}
        },
        {
            "id": "bank-widget", "type": "element_bank",
            "x": 37, "y": 4600, "w": 500, "h": 800, "z": 10,
            "props": {"title": "Gửi lời chúc mừng"}
        }
    ]
}

# Output as JSON
with open('hoa_moc_xanh_config.json', 'w', encoding='utf-8') as f:
    json.dump(config, f, ensure_ascii=False, indent=2)

print("Template config generated: hoa_moc_xanh_config.json")
