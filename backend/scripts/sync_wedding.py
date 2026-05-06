import sys
import os
import json

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from database import SessionLocal
import models

def sync_wedding(wedding_id, template_id):
    db = SessionLocal()
    try:
        template = db.query(models.Template).filter(models.Template.id == template_id).first()
        wedding = db.query(models.Wedding).filter(models.Wedding.id == wedding_id).first()
        
        if not template or not wedding:
            print("Template or Wedding not found")
            return
        
        # Update wedding config_data with template config_data
        wedding.config_data = template.config_data
        db.commit()
        print(f"Success! Wedding {wedding.slug} updated to latest Template {template.id} design.")
        
    except Exception as e:
        print(f"Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    sync_wedding(4, 1) # Sync wedding 4 with template 1
