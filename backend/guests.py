from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import models, database, auth
import time
from pydantic import BaseModel, ConfigDict
from typing import List, Optional

class GuestCreate(BaseModel):
    guest_name: str
    custom_slug: str
    category: Optional[str] = "Bạn bè"
    adult_count: int = 1

class GuestBatchCreate(BaseModel):
    guests: List[GuestCreate]

class GuestRSVP(BaseModel):
    status: str
    adult_count: Optional[int] = None
    children_count: Optional[int] = None
    wish_message: Optional[str] = None

class GuestOut(GuestCreate):
    id: int
    wedding_id: int
    status: str
    children_count: int
    wish_message: Optional[str] = None
    model_config = ConfigDict(from_attributes=True)

router = APIRouter(prefix="/api/v1/guests", tags=["guests"])

@router.post("/{wedding_id}", response_model=GuestOut)
def create_guest(wedding_id: int, guest: GuestCreate, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    wedding = db.query(models.Wedding).filter(models.Wedding.id == wedding_id, models.Wedding.owner_id == current_user.id).first()
    if not wedding:
        raise HTTPException(status_code=403, detail="Not owner of this wedding")
    
    db_guest = models.Guest(**guest.model_dump(), wedding_id=wedding_id)
    db.add(db_guest)
    db.commit()
    db.refresh(db_guest)
    return db_guest

@router.post("/{wedding_id}/batch", response_model=List[GuestOut])
def batch_create_guests(wedding_id: int, batch: GuestBatchCreate, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    wedding = db.query(models.Wedding).filter(models.Wedding.id == wedding_id, models.Wedding.owner_id == current_user.id).first()
    if not wedding:
        raise HTTPException(status_code=403, detail="Not owner of this wedding")
    
    created_guests = []
    for guest_data in batch.guests:
        db_guest = models.Guest(**guest_data.model_dump(), wedding_id=wedding_id)
        db.add(db_guest)
        created_guests.append(db_guest)
    
    db.commit()
    for g in created_guests:
        db.refresh(g)
    return created_guests

@router.get("/{wedding_id}", response_model=List[GuestOut])
def get_guests(wedding_id: int, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    wedding = db.query(models.Wedding).filter(models.Wedding.id == wedding_id, models.Wedding.owner_id == current_user.id).first()
    if not wedding:
        raise HTTPException(status_code=403, detail="Not owner")
    return db.query(models.Guest).filter(models.Guest.wedding_id == wedding_id).all()

@router.post("/rsvp/{guest_id}")
def rsvp_guest(guest_id: int, rsvp: GuestRSVP, db: Session = Depends(database.get_db)):
    guest = db.query(models.Guest).filter(models.Guest.id == guest_id).first()
    if not guest:
        raise HTTPException(status_code=404, detail="Guest not found")
    
    guest.status = rsvp.status
    if rsvp.adult_count is not None:
        guest.adult_count = rsvp.adult_count
    if rsvp.children_count is not None:
        guest.children_count = rsvp.children_count
    if rsvp.wish_message is not None:
        guest.wish_message = rsvp.wish_message
        
    db.commit()
    db.refresh(guest)
    return guest

@router.get("/public/{wedding_slug}/{guest_slug}", response_model=GuestOut)
def get_public_guest(wedding_slug: str, guest_slug: str, db: Session = Depends(database.get_db)):
    wedding = db.query(models.Wedding).filter(models.Wedding.slug == wedding_slug).first()
    if not wedding:
        raise HTTPException(status_code=404, detail="Wedding not found")
    guest = db.query(models.Guest).filter(models.Guest.wedding_id == wedding.id, models.Guest.custom_slug == guest_slug).first()
    if not guest:
        raise HTTPException(status_code=404, detail="Guest not found")
    return guest

@router.get("/stats/{wedding_id}")
def get_guest_stats(wedding_id: int, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    wedding = db.query(models.Wedding).filter(models.Wedding.id == wedding_id, models.Wedding.owner_id == current_user.id).first()
    if not wedding:
        raise HTTPException(status_code=403, detail="Not owner")
    
    guests = db.query(models.Guest).filter(models.Guest.wedding_id == wedding_id).all()
    
    stats = {
        "total": len(guests),
        "attending": len([g for g in guests if g.status == "attending"]),
        "wishes_only": len([g for g in guests if g.status == "wishes_only"]),
        "not_attending": len([g for g in guests if g.status == "not_attending"]),
        "unread": len([g for g in guests if g.status == "unread"]),
        "total_adults": sum([g.adult_count for g in guests if g.status == "attending"]),
        "total_children": sum([g.children_count for g in guests if g.status == "attending"])
    }
    return stats
@router.get("/wishes/{wedding_slug}")
def get_public_wishes(wedding_slug: str, db: Session = Depends(database.get_db)):
    wedding = db.query(models.Wedding).filter(models.Wedding.slug == wedding_slug).first()
    if not wedding:
        raise HTTPException(status_code=404, detail="Wedding not found")
    
    # Return only name and message for guests who actually left a wish
    guests = db.query(models.Guest).filter(
        models.Guest.wedding_id == wedding.id,
        models.Guest.wish_message != None,
        models.Guest.wish_message != ""
    ).all()
    
    return [{"name": g.guest_name, "message": g.wish_message} for g in guests]

class PublicWishCreate(BaseModel):
    guest_name: str
    wish_message: str

@router.post("/wishes/{wedding_slug}")
def create_public_wish(wedding_slug: str, wish: PublicWishCreate, db: Session = Depends(database.get_db)):
    wedding = db.query(models.Wedding).filter(models.Wedding.slug == wedding_slug).first()
    if not wedding:
        raise HTTPException(status_code=404, detail="Wedding not found")

    # Generate a unique slug for walk-in wish guests
    unique_slug = f"wish-{int(time.time() * 1000)}"
        
    db_guest = models.Guest(
        wedding_id=wedding.id,
        guest_name=wish.guest_name,
        wish_message=wish.wish_message,
        status="wishes_only",
        custom_slug=unique_slug
    )
    db.add(db_guest)
    db.commit()
    db.refresh(db_guest)
    return {"status": "success", "message": "Wish added successfully"}

@router.delete("/item/{guest_id}")
def delete_guest(guest_id: int, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    """Delete a guest. Only the wedding owner can delete."""
    guest = db.query(models.Guest).filter(models.Guest.id == guest_id).first()
    if not guest:
        raise HTTPException(status_code=404, detail="Guest not found")
    
    # Verify ownership via wedding
    wedding = db.query(models.Wedding).filter(
        models.Wedding.id == guest.wedding_id,
        models.Wedding.owner_id == current_user.id
    ).first()
    if not wedding:
        raise HTTPException(status_code=403, detail="Not authorized to delete this guest")
    
    db.delete(guest)
    db.commit()
    return {"message": f"Guest '{guest.guest_name}' deleted successfully"}
