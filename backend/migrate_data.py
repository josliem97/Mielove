import os
import sqlite3
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import models

# 1. Connect to local SQLite
sqlite_conn = sqlite3.connect(r'e:\VINFAST\Mielove\backend\mielove.db')
sqlite_conn.row_factory = sqlite3.Row
sqlite_cur = sqlite_conn.cursor()

# 2. Connect to Neon PostgreSQL
neon_url = "postgresql://neondb_owner:npg_EFZdLwmT1p9Q@ep-odd-haze-aqhzmkpj.c-8.us-east-1.aws.neon.tech/neondb?sslmode=require"
engine = create_engine(neon_url)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create tables in Neon
try:
    models.Base.metadata.create_all(bind=engine)
except Exception as e:
    print("create_all warning:", e)

db = SessionLocal()

print("Migrating Templates...")
sqlite_cur.execute("SELECT * FROM templates")
templates = sqlite_cur.fetchall()
for t in templates:
    existing = db.query(models.Template).filter(models.Template.id == t['id']).first()
    if not existing:
        new_template = models.Template(
            id=t['id'],
            name=t['name'],
            category=t['category'],
            thumbnail_url=t['thumbnail_url'],
            config_data=t['config_data'],
            html_content=t['html_content'],
            css_style=t['css_style'],
            location=t['location'],
            music_url=t['music_url'],
            bank_qr_code=t['bank_qr_code'],
            bank_name=t['bank_name'],
            bank_account=t['bank_account'],
            bank_account_name=t['bank_account_name']
        )
        db.add(new_template)
db.commit()

print("Migrating Admin Users...")
sqlite_cur.execute("SELECT * FROM users")
users = sqlite_cur.fetchall()
for u in users:
    existing = db.query(models.User).filter(models.User.email == u['email']).first()
    if not existing:
        new_user = models.User(
            id=u['id'],
            email=u['email'],
            username=u['username'],
            hashed_password=u['hashed_password'],
            is_active=u['is_active'],
            role=u['role']
        )
        db.add(new_user)
db.commit()

print("Data migration to Neon PostgreSQL completed successfully!")
db.close()
sqlite_conn.close()
