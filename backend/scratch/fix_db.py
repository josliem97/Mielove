import sqlite3
import os

db_path = "mielove.db"

if not os.path.exists(db_path):
    print(f"Database {db_path} not found.")
    exit(1)

conn = sqlite3.connect(db_path)
cursor = conn.cursor()

def add_column(table, column, type):
    try:
        cursor.execute(f"ALTER TABLE {table} ADD COLUMN {column} {type}")
        print(f"Added column {column} to {table}")
    except sqlite3.OperationalError as e:
        if "duplicate column name" in str(e):
            print(f"Column {column} already exists in {table}")
        else:
            print(f"Error adding {column} to {table}: {e}")

# Add columns to Guest table
add_column("guests", "category", "TEXT DEFAULT 'Khác'")
add_column("guests", "wish_message", "TEXT")

# Add columns to Wedding table
add_column("weddings", "music_url", "TEXT")
add_column("weddings", "bank_qr_code", "TEXT")
add_column("weddings", "bank_name", "TEXT")
add_column("weddings", "bank_account", "TEXT")
add_column("weddings", "bank_account_name", "TEXT")

conn.commit()
conn.close()
print("Database fix completed.")
