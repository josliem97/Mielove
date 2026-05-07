from pydantic import BaseModel, ConfigDict, field_validator
from typing import List, Optional, Dict, Any
from datetime import datetime
import json

class UserBase(BaseModel):
    email: str
    username: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    role: str
    is_active: bool
    model_config = ConfigDict(from_attributes=True)

class TemplateBase(BaseModel):
    name: str
    thumbnail_url: Optional[str] = None
    category: Optional[str] = "Tất cả"
    config_data: Optional[Dict[str, Any]] = None

    @field_validator('config_data', mode='before')
    @classmethod
    def parse_config_data(cls, v):
        if isinstance(v, str):
            try:
                return json.loads(v)
            except Exception:
                return {}
        return v

class TemplateCreate(TemplateBase):
    html_content: str
    css_style: str

class Template(TemplateBase):
    id: int
    html_content: Optional[str] = None
    css_style: Optional[str] = None
    model_config = ConfigDict(from_attributes=True)

class WeddingBase(BaseModel):
    slug: str
    groom_name: Optional[str] = None
    bride_name: Optional[str] = None
    wedding_date: Optional[str] = None
    location: Optional[str] = None
    music_url: Optional[str] = None
    bank_qr_code: Optional[str] = None
    bank_name: Optional[str] = None
    bank_account: Optional[str] = None
    config_data: Optional[Dict[str, Any]] = None
    is_paid: Optional[bool] = False
    plan_type: Optional[str] = "free"

    @field_validator('config_data', mode='before')
    @classmethod
    def parse_config_data(cls, v):
        if isinstance(v, str):
            try:
                return json.loads(v)
            except Exception:
                return {}
        return v

class WeddingCreate(WeddingBase):
    template_id: int

class Wedding(WeddingBase):
    id: int
    owner_id: int
    template_id: int
    gallery_images: Optional[List[Any]] = []
    guest_count: Optional[int] = 0
    confirmed_count: Optional[int] = 0
    model_config = ConfigDict(from_attributes=True)

    @field_validator('gallery_images', mode='before')
    @classmethod
    def parse_gallery_images(cls, v):
        if v is None:
            return []
        if isinstance(v, str):
            try:
                import json
                return json.loads(v)
            except:
                return []
        return v

class GuestBase(BaseModel):
    guest_name: str
    custom_slug: str
    status: Optional[str] = "unread"
    adult_count: int = 1
    children_count: int = 0
    wish_message: Optional[str] = None
    category: Optional[str] = "Khác"

class GuestCreate(GuestBase):
    pass

class Guest(GuestBase):
    id: int
    wedding_id: int
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class Token(BaseModel):
    access_token: str
    token_type: str
    username: Optional[str] = None

class TokenData(BaseModel):
    username: Optional[str] = None
