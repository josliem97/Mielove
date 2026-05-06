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
models.Base.metadata.create_all(bind=engine)

db = SessionLocal()

print("Migrating Templates...")
sqlite_cur.execute("SELECT * FROM templates")
templates = sqlite_cur.fetchall()
for t in templates:
    # check if exists
    existing = db.query(models.Template).filter(models.Template.id == t['id']).first()
    if not existing:
        new_template = models.Template(
            id=t['id'],
            name=t['name'],
            category=t['category'],
            price=t['price'],
            thumbnail_url=t['thumbnail_url'],
            config_data=t['config_data'],
            is_premium=t['is_premium']
        )
        db.add(new_template)
db.commit()

print("Data migration to Neon PostgreSQL completed successfully!")
db.close()
sqlite_conn.close()
