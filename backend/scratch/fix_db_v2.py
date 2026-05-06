import sqlite3
import os

db_path = "mielove.db"
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

def add_column(table, column, type):
    try:
        cursor.execute(f"ALTER TABLE {table} ADD COLUMN {column} {type}")
        print(f"Added column {column} to {table}")
    except sqlite3.OperationalError as e:
        print(f"Column {column} in {table}: {e}")

add_column("guests", "created_at", "DATETIME DEFAULT CURRENT_TIMESTAMP")
add_column("weddings", "location", "TEXT")

conn.commit()
conn.close()
print("Final verification completed.")
