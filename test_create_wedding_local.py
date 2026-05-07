import os
import sys

# Change cwd to backend so imports work
os.chdir('e:/VINFAST/Mielove/backend')
sys.path.append(os.getcwd())

from dotenv import load_dotenv
load_dotenv() # this will load backend/.env

import models
import schemas
import database
from sqlalchemy.orm import Session
from datetime import datetime

import weddings # to use replace_placeholders if needed

# 1. Connect to DB
engine = database.engine
SessionLocal = database.SessionLocal

# 2. Get a test user (smoketest999)
db = SessionLocal()
try:
    user = db.query(models.User).filter(models.User.username == 'smoketest999').first()
    if not user:
        print("Test user not found, please check DB.")
        sys.exit(1)
        
    print(f"Found user: {user.id}")

    # 3. Try to create a wedding
    wedding_create = schemas.WeddingCreate(
        template_id=1,
        slug=f"smoketest999-wedding-{int(datetime.now().timestamp())}",
        groom_name="Groom",
        bride_name="Bride",
        wedding_date="2026-10-10",
        location="Hanoi"
    )

    print("Creating wedding...")
    # Emulate the weddings.create_wedding function
    if db.query(models.Wedding).filter(models.Wedding.slug == wedding_create.slug).first():
        print("Slug in use")
    else:
        initial_config = {}
        if wedding_create.template_id:
            template = db.query(models.Template).filter(models.Template.id == wedding_create.template_id).first()
            if template and template.config_data:
                import copy
                initial_config = copy.deepcopy(template.config_data)
                # Map placeholders
                d_iso = wedding_create.wedding_date.split('T')[0] if (wedding_create.wedding_date and 'T' in wedding_create.wedding_date) else wedding_create.wedding_date
                d_obj = None
                if d_iso:
                    try: d_obj = datetime.strptime(d_iso, '%Y-%m-%d')
                    except: pass
                
                dot_date = d_obj.strftime('%d . %m . %Y') if d_obj else (d_iso or "Chưa xác định")
                display_date = d_obj.strftime('%d/%m/%Y') if d_obj else (d_iso or "Chưa xác định")

                data_map = {
                    "groom_name": wedding_create.groom_name,
                    "bride_name": wedding_create.bride_name,
                    "wedding_date": d_iso or "Chưa xác định",
                    "wedding_date_dot": dot_date,
                    "wedding_date_display": display_date,
                    "wedding_time": wedding_create.wedding_date.split('T')[1] if (wedding_create.wedding_date and 'T' in wedding_create.wedding_date) else "09:00",
                    "location": wedding_create.location or "Địa điểm chưa xác định"
                }
                initial_config = weddings.replace_placeholders(initial_config, data_map)

        wedding_data = wedding_create.model_dump()
        wedding_data.pop('config_data', None)

        db_wedding = models.Wedding(
            **wedding_data, 
            owner_id=user.id,
            config_data=initial_config
        )
        db.add(db_wedding)
        db.commit()
        db.refresh(db_wedding)
        print("Success! Created wedding id:", db_wedding.id)

except Exception as e:
    import traceback
    traceback.print_exc()
finally:
    db.close()
