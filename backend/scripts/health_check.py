import os
import sys

# Add parent directory to path to import models
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy import inspect
from database import engine
import models

def check_db_health():
    print("--- Mielove Database Health Check ---")
    inspector = inspect(engine)
    
    # Tables to check
    tables = ["users", "templates", "weddings", "guests"]
    missing_any = False
    
    for table_name in tables:
        if not inspector.has_table(table_name):
            print(f"[ERROR] Table '{table_name}' is missing!")
            missing_any = True
            continue
            
        # Get actual columns in DB
        columns = [c["name"] for c in inspector.get_columns(table_name)]
        
        # Determine expected columns from SQLAlchemy models
        model_class = None
        if table_name == "users": model_class = models.User
        elif table_name == "templates": model_class = models.Template
        elif table_name == "weddings": model_class = models.Wedding
        elif table_name == "guests": model_class = models.Guest
        
        expected_columns = model_class.__table__.columns.keys()
        
        missing_columns = [c for c in expected_columns if c not in columns]
        
        if missing_columns:
            print(f"[WARNING] Table '{table_name}' is missing columns: {missing_columns}")
            missing_any = True
        else:
            print(f"[OK] Table '{table_name}' is synchronized.")

    if missing_any:
        print("\n[ACTION REQUIRED] Attempting to create missing columns...")
        # create_all will only create missing tables, not columns in SQLite.
        # For SQLite, we might need to alter table manually if missing columns exist.
        try:
            models.Base.metadata.create_all(bind=engine)
            print("[INFO] create_all() executed. Note: This only creates missing tables, not individual columns.")
            print("[TIP] If columns are still missing, you may need to delete the .db file or run manual ALTER TABLE commands.")
        except Exception as e:
            print(f"[ERROR] Could not sync database: {e}")
    else:
        print("\n[SUCCESS] Database is fully healthy and synchronized with models.")

if __name__ == "__main__":
    check_db_health()
