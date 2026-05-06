from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, JSON, Text, DateTime
from sqlalchemy.orm import relationship
from database import Base
import datetime

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    username = Column(String, index=True)
    hashed_password = Column(String)
    role = Column(String, default="user")
    is_active = Column(Boolean, default=True)

    weddings = relationship("Wedding", back_populates="owner")

class Template(Base):
    __tablename__ = "templates"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    thumbnail_url = Column(String)
    html_content = Column(String)
    css_style = Column(String)
    category = Column(String, default="Tất cả")
    location = Column(String)
    music_url = Column(String)
    bank_qr_code = Column(String)
    bank_name = Column(String)
    bank_account = Column(String)
    bank_account_name = Column(String)
    config_data = Column(JSON, default=dict)

class Wedding(Base):
    __tablename__ = "weddings"

    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey("users.id"))
    template_id = Column(Integer, ForeignKey("templates.id"))
    slug = Column(String, unique=True, index=True)

    groom_name = Column(String)
    bride_name = Column(String)
    wedding_date = Column(String)
    location = Column(String)
    map_url = Column(String)
    music_url = Column(String)
    gallery_images = Column(JSON, default=list)
    bank_qr_code = Column(String)
    bank_name = Column(String)
    bank_account = Column(String)
    bank_account_name = Column(String)
    config_data = Column(JSON, default=dict)

    owner = relationship("User", back_populates="weddings")
    guests = relationship("Guest", back_populates="wedding")

class Guest(Base):
    __tablename__ = "guests"

    id = Column(Integer, primary_key=True, index=True)
    wedding_id = Column(Integer, ForeignKey("weddings.id"))
    guest_name = Column(String)
    custom_slug = Column(String, index=True)
    status = Column(String, default="unread")
    adult_count = Column(Integer, default=1)
    children_count = Column(Integer, default=0)
    wish_message = Column(Text)
    category = Column(String, default="Khác")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    wedding = relationship("Wedding", back_populates="guests")
