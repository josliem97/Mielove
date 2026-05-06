import sys
import os

sys.path.append(os.getcwd())

from database import SessionLocal
import models
import schemas

db = SessionLocal()

try:
    print("Testing Template fetch...")
    templates = db.query(models.Template).all()
    print(f"Found {len(templates)} templates.")
    if templates:
        t = templates[0]
        pydantic_t = schemas.Template.model_validate(t)
        print("Template Pydantic validation successful.")
        print(f"Sample: {pydantic_t.name}")

    print("Testing Wedding fetch...")
    weddings = db.query(models.Wedding).all()
    print(f"Found {len(weddings)} weddings.")
    if weddings:
        w = weddings[0]
        # Injected fields
        w.guest_count = 5
        w.confirmed_count = 2
        pydantic_w = schemas.Wedding.model_validate(w)
        print("Wedding Pydantic validation successful.")

except Exception as e:
    print(f"CRITICAL ERROR: {e}")
    import traceback
    traceback.print_exc()
finally:
    db.close()
