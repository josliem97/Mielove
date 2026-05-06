from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
import models, schemas, database, auth
from typing import List

router = APIRouter(prefix="/api/v1/weddings", tags=["weddings"])

import json
import copy

def replace_placeholders(obj, data_map):
    """Recursively replace placeholders in a JSON-like object."""
    if isinstance(obj, dict):
        return {k: replace_placeholders(v, data_map) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [replace_placeholders(v, data_map) for v in obj]
    elif isinstance(obj, str):
        for key, val in data_map.items():
            if val is not None:
                obj = obj.replace(f"{{{{{key}}}}}", str(val))
        return obj
    else:
        return obj

@router.post("/", response_model=schemas.Wedding)
def create_wedding(wedding: schemas.WeddingCreate, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    if db.query(models.Wedding).filter(models.Wedding.slug == wedding.slug).first():
        raise HTTPException(status_code=400, detail="Slug already in use")
    
    # Inherit config_data from template if template_id is provided
    initial_config = {}
    if wedding.template_id:
        template = db.query(models.Template).filter(models.Template.id == wedding.template_id).first()
        if template and template.config_data:
            # Deep copy to avoid modifying the template's master config
            initial_config = copy.deepcopy(template.config_data)
            
            # Map placeholders
            from datetime import datetime
            
            d_iso = wedding.wedding_date.split('T')[0] if (wedding.wedding_date and 'T' in wedding.wedding_date) else wedding.wedding_date
            d_obj = None
            if d_iso:
                try: d_obj = datetime.strptime(d_iso, '%Y-%m-%d')
                except: pass
            
            dot_date = d_obj.strftime('%d . %m . %Y') if d_obj else (d_iso or "Chưa xác định")
            display_date = d_obj.strftime('%d/%m/%Y') if d_obj else (d_iso or "Chưa xác định")

            data_map = {
                "groom_name": wedding.groom_name,
                "bride_name": wedding.bride_name,
                "wedding_date": d_iso or "Chưa xác định",
                "wedding_date_dot": dot_date,
                "wedding_date_display": display_date,
                "wedding_time": wedding.wedding_date.split('T')[1] if (wedding.wedding_date and 'T' in wedding.wedding_date) else "09:00",
                "location": wedding.location or "Địa điểm chưa xác định"
            }
            # Inject user data into the config JSON
            initial_config = replace_placeholders(initial_config, data_map)

    # Remove config_data from dump to avoid duplicate values error
    wedding_data = wedding.model_dump()
    wedding_data.pop('config_data', None)

    db_wedding = models.Wedding(
        **wedding_data, 
        owner_id=current_user.id,
        config_data=initial_config
    )
    db.add(db_wedding)
    db.commit()
    db.refresh(db_wedding)
    return db_wedding

@router.get("/me", response_model=List[schemas.Wedding])
def get_my_weddings(db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    # Optimized query to get weddings with guest counts in fewer trips to DB
    weddings = db.query(models.Wedding).filter(models.Wedding.owner_id == current_user.id).all()
    
    # Batch fetch guest counts for all user's weddings
    wedding_ids = [w.id for w in weddings]
    if not wedding_ids:
        return []
        
    # Total guests per wedding
    guest_counts = db.query(
        models.Guest.wedding_id, 
        func.count(models.Guest.id).label('total')
    ).filter(models.Guest.wedding_id.in_(wedding_ids)).group_by(models.Guest.wedding_id).all()
    
    # Confirmed guests per wedding
    confirmed_counts = db.query(
        models.Guest.wedding_id, 
        func.count(models.Guest.id).label('confirmed')
    ).filter(models.Guest.wedding_id.in_(wedding_ids), models.Guest.status == 'attending').group_by(models.Guest.wedding_id).all()
    
    # Map counts to weddings
    total_map = {row.wedding_id: row.total for row in guest_counts}
    confirmed_map = {row.wedding_id: row.confirmed for row in confirmed_counts}
    
    for w in weddings:
        w.guest_count = total_map.get(w.id, 0)
        w.confirmed_count = confirmed_map.get(w.id, 0)
        
    return weddings

@router.get("/{slug}", response_model=schemas.Wedding)
def get_wedding_by_slug(slug: str, db: Session = Depends(database.get_db)):
    wedding = db.query(models.Wedding).filter(models.Wedding.slug == slug).first()
    if not wedding:
        raise HTTPException(status_code=404, detail="Wedding not found")
    return wedding

@router.get("/id/{wedding_id}", response_model=schemas.Wedding)
def get_wedding_by_id(wedding_id: int, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    wedding = db.query(models.Wedding).filter(models.Wedding.id == wedding_id, models.Wedding.owner_id == current_user.id).first()
    if not wedding:
        raise HTTPException(status_code=404, detail="Wedding not found or not owned")
    return wedding

@router.put("/{wedding_id}", response_model=schemas.Wedding)
def update_wedding(wedding_id: int, wedding_update: schemas.WeddingBase, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    db_wedding = db.query(models.Wedding).filter(models.Wedding.id == wedding_id, models.Wedding.owner_id == current_user.id).first()
    if not db_wedding:
        raise HTTPException(status_code=404, detail="Wedding not found or not owned")
    
    for key, value in wedding_update.model_dump(exclude_unset=True).items():
        setattr(db_wedding, key, value)
    
    db.commit()
    db.refresh(db_wedding)
    return db_wedding

@router.delete("/{wedding_id}")
def delete_wedding(wedding_id: int, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    db_wedding = db.query(models.Wedding).filter(models.Wedding.id == wedding_id, models.Wedding.owner_id == current_user.id).first()
    if not db_wedding:
        raise HTTPException(status_code=404, detail="Wedding not found or not owned")
    
    # Also delete associated guests
    db.query(models.Guest).filter(models.Guest.wedding_id == wedding_id).delete()
    
    db.delete(db_wedding)
    db.commit()
    return {"message": "Wedding and associated guests deleted successfully"}

@router.post("/{wedding_id}/clone", response_model=schemas.Wedding)
def clone_wedding(wedding_id: int, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    db_wedding = db.query(models.Wedding).filter(models.Wedding.id == wedding_id, models.Wedding.owner_id == current_user.id).first()
    if not db_wedding:
        raise HTTPException(status_code=404, detail="Wedding not found or not owned")
    
    # Create new slug with -copy suffix
    import time
    new_slug = f"{db_wedding.slug}-copy-{int(time.time())}"
    
    cloned_wedding = models.Wedding(
        owner_id=current_user.id,
        template_id=db_wedding.template_id,
        slug=new_slug,
        groom_name=f"{db_wedding.groom_name} (Copy)" if db_wedding.groom_name else None,
        bride_name=db_wedding.bride_name,
        wedding_date=db_wedding.wedding_date,
        location=db_wedding.location,
        map_url=db_wedding.map_url,
        music_url=db_wedding.music_url,
        bank_qr_code=db_wedding.bank_qr_code,
        bank_name=db_wedding.bank_name,
        bank_account=db_wedding.bank_account,
        bank_account_name=db_wedding.bank_account_name,
        config_data=db_wedding.config_data
    )
    
    db.add(cloned_wedding)
    db.commit()
    db.refresh(cloned_wedding)
    return cloned_wedding
