from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import models, database, auth

router = APIRouter(prefix="/api/v1/templates", tags=["templates"])

@router.get("")
def get_templates(db: Session = Depends(database.get_db)):
    return db.query(models.Template).all()

@router.post("")
def create_template(name: str, thumbnail_url: str, html_content: str, css_style: str, category: str, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    template = models.Template(name=name, thumbnail_url=thumbnail_url, html_content=html_content, css_style=css_style, category=category)
    db.add(template)
    db.commit()
    db.refresh(template)
    return template

@router.get("/{template_id}")
def get_template(template_id: int, db: Session = Depends(database.get_db)):
    template = db.query(models.Template).filter(models.Template.id == template_id).first()
    if not template:
        raise HTTPException(status_code=404, detail="Template not found")
    return template

@router.post("/seed")
def seed_templates(db: Session = Depends(database.get_db)):
    # Relative-Recursive Template Configuration
    config_miu_master = {
        "canvas": {"width": 575, "height": 4500, "backgroundColor": "#FBFBFB", "texture": "none"},
        "components": [
            {
                "id": "hero_section",
                "type": "container",
                "x": 0, "y": 0, "w": 575, "h": 1100, "z": 1,
                "props": {"fill": "#ffffff"},
                "components": [
                    {
                        "id": "hero_bg_img",
                        "type": "element_image",
                        "x": -25, "y": 0, "w": 625, "h": 700, "z": 1,
                        "props": {"src": "https://images.unsplash.com/photo-1546032996-6dfacbacba38?w=1200", "objectFit": "cover"}
                    },
                    {
                        "id": "hero_frame",
                        "type": "element_shape",
                        "x": 40, "y": 700, "w": 495, "h": 350, "z": 2,
                        "props": {"fill": "#f9f8f6", "borderRadius": 12},
                        "style": {"boxShadow": "0 -20px 40px rgba(0,0,0,0.05)"}
                    },
                    {
                        "id": "hero_title",
                        "type": "element_text",
                        "x": 40, "y": 750, "w": 495, "h": 140, "z": 3,
                        "props": {"text": "{{groom_name}}\n&\n{{bride_name}}", "fontSize": 64, "color": "#1D1D1F", "align": "center", "fontFamily": "'Dancing Script', cursive"}
                    },
                    {
                        "id": "hero_date",
                        "type": "element_text",
                        "x": 40, "y": 900, "w": 495, "h": 50, "z": 3,
                        "props": {"text": "SAVE THE DATE | {{wedding_date}}", "fontSize": 12, "color": "#666", "align": "center", "fontWeight": "bold", "style": {"letterSpacing": "0.2em"}}
                    }
                ]
            },
            {
                "id": "parents_section",
                "type": "container",
                "x": 0, "y": 1100, "w": 575, "h": 800, "z": 1,
                "props": {"fill": "#f5f5f7"},
                "components": [
                    {
                        "id": "parents_heading",
                        "type": "element_text",
                        "x": 0, "y": 100, "w": 575, "h": 60, "z": 2,
                        "props": {"text": "Trân trọng kính mời", "fontSize": 32, "color": "#1D1D1F", "align": "center", "fontFamily": "serif"}
                    },
                    {
                        "id": "parents_body",
                        "type": "element_text",
                        "x": 60, "y": 200, "w": 455, "h": 200, "z": 2,
                        "props": {"text": "Đến dự buổi tiệc chung vui cùng gia đình chúng tôi", "fontSize": 18, "color": "#555", "align": "center", "fontFamily": "sans-serif"}
                    }
                ]
            },
            {
                "id": "timeline_section",
                "type": "container",
                "x": 0, "y": 1900, "w": 575, "h": 1200, "z": 1,
                "props": {"fill": "#ffffff"},
                "components": [
                    {
                        "id": "timeline_cal",
                        "type": "element_calendar",
                        "x": 50, "y": 100, "w": 475, "h": 250, "z": 2,
                        "props": {"date": "{{wedding_date}}", "time": "10:00", "label": "LỄ THÀNH HÔN"}
                    },
                    {
                        "id": "timeline_rsvp",
                        "type": "element_rsvp",
                        "x": 62, "y": 400, "w": 450, "h": 350, "z": 2,
                        "style": {"background": "#fafaf9", "borderRadius": "20px", "border": "1px solid #eaeaea"}
                    }
                ]
            }
        ]
    }

    default_templates = [
        {"name": "Miu Master Reference", "thumb": "https://images.unsplash.com/photo-1519741497674-611481863552?w=800", "cat": "Premium", "cfg": config_miu_master}
    ]

    for t_data in default_templates:
        existing = db.query(models.Template).filter(models.Template.name == t_data["name"]).first()
        if existing:
            existing.config_data = t_data["cfg"]
            existing.thumbnail_url = t_data["thumb"]
            existing.category = t_data["cat"]
        else:
            new_t = models.Template(
                name=t_data["name"],
                thumbnail_url=t_data["thumb"],
                category=t_data["cat"],
                config_data=t_data["cfg"],
                html_content="", # Legacy
                css_style=""     # Legacy
            )
            db.add(new_t)
    
    db.commit()
    return {"message": "Premium templates seeded/updated successfully"}
