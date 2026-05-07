from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import models, database
import auth, templates, weddings, guests, uploads

import os
from dotenv import load_dotenv

load_dotenv()

from sqlalchemy import inspect, text

models.Base.metadata.create_all(bind=database.engine)

def run_migrations(engine):
    """Safely add any missing columns to existing tables (no data loss)."""
    inspector = inspect(engine)

    migrations_by_table = {
        "weddings": [
            ("map_url",           "ALTER TABLE weddings ADD COLUMN IF NOT EXISTS map_url VARCHAR"),
            ("gallery_images",    "ALTER TABLE weddings ADD COLUMN IF NOT EXISTS gallery_images JSON DEFAULT '[]'::json"),
            ("bank_qr_code",      "ALTER TABLE weddings ADD COLUMN IF NOT EXISTS bank_qr_code VARCHAR"),
            ("bank_name",         "ALTER TABLE weddings ADD COLUMN IF NOT EXISTS bank_name VARCHAR"),
            ("bank_account",      "ALTER TABLE weddings ADD COLUMN IF NOT EXISTS bank_account VARCHAR"),
            ("bank_account_name", "ALTER TABLE weddings ADD COLUMN IF NOT EXISTS bank_account_name VARCHAR"),
            ("config_data",       "ALTER TABLE weddings ADD COLUMN IF NOT EXISTS config_data JSON DEFAULT '{}'::json"),
        ],
        "templates": [
            ("location",          "ALTER TABLE templates ADD COLUMN IF NOT EXISTS location VARCHAR"),
            ("music_url",         "ALTER TABLE templates ADD COLUMN IF NOT EXISTS music_url VARCHAR"),
            ("bank_qr_code",      "ALTER TABLE templates ADD COLUMN IF NOT EXISTS bank_qr_code VARCHAR"),
            ("bank_name",         "ALTER TABLE templates ADD COLUMN IF NOT EXISTS bank_name VARCHAR"),
            ("bank_account",      "ALTER TABLE templates ADD COLUMN IF NOT EXISTS bank_account VARCHAR"),
            ("bank_account_name", "ALTER TABLE templates ADD COLUMN IF NOT EXISTS bank_account_name VARCHAR"),
            ("config_data",       "ALTER TABLE templates ADD COLUMN IF NOT EXISTS config_data JSON DEFAULT '{}'::json"),
        ],
        "guests": [
            ("category",   "ALTER TABLE guests ADD COLUMN IF NOT EXISTS category VARCHAR DEFAULT 'Khác'"),
            ("created_at", "ALTER TABLE guests ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT NOW()"),
        ],
    }

    with engine.connect() as conn:
        for table, migrations in migrations_by_table.items():
            if not inspector.has_table(table):
                continue
            for col_name, sql in migrations:
                try:
                    conn.execute(text(sql))
                    conn.commit()
                except Exception as e:
                    print(f"Migration skipped ({table}.{col_name}): {e}")

run_migrations(database.engine)

app = FastAPI(title="Mielove API", redirect_slashes=False)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://mielove.vercel.app", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(templates.router)
app.include_router(weddings.router)
app.include_router(guests.router)
app.include_router(uploads.router)

@app.get("/ping_deploy")
def ping_deploy():
    return {"version": "v5"}

@app.get("/")
def read_root():
    return {"message": "Mielove Backend is running! v5"}

from fastapi import Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import ResponseValidationError
import traceback

@app.exception_handler(ResponseValidationError)
async def validation_exception_handler(request: Request, exc: ResponseValidationError):
    return JSONResponse(
        status_code=500,
        content={"detail": "Response Validation Error", "errors": str(exc.errors()), "traceback": traceback.format_exc()}
    )

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"detail": "Global Exception", "traceback": traceback.format_exc()}
    )
