import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import sessionmaker

load_dotenv()

SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./mielove.db")

print(f"DEBUG: Connecting to DB: {SQLALCHEMY_DATABASE_URL.split('@')[-1] if '@' in SQLALCHEMY_DATABASE_URL else SQLALCHEMY_DATABASE_URL}")

# Only add check_same_thread for SQLite
connect_args = {"check_same_thread": False} if SQLALCHEMY_DATABASE_URL.startswith("sqlite") else {}

try:
    engine = create_engine(
        SQLALCHEMY_DATABASE_URL, connect_args=connect_args
    )
    # Test connection
    with engine.connect() as conn:
        print("DEBUG: Database connection successful!")
except Exception as e:
    print(f"DEBUG: Database connection FAILED: {e}")
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
