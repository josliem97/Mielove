import sqlite3
import json

try:
    conn = sqlite3.connect('mielove.db')
    cursor = conn.cursor()
    
    # Check templates table columns
    cursor.execute("PRAGMA table_info(templates)")
    columns = [row[1] for row in cursor.fetchall()]
    print(f"Templates Columns: {columns}")
    
    if 'config_data' not in columns:
        print("ERROR: config_data column is MISSING in templates table!")
    else:
        cursor.execute("SELECT name, config_data FROM templates")
        rows = cursor.fetchall()
        for name, cfg in rows:
            print(f"Template '{name}': Config length {len(cfg) if cfg else 'N/A'}")
            if cfg:
                try:
                    json.loads(cfg)
                    print(f"  - Valid JSON")
                except:
                    print(f"  - INVALID JSON content")

    # Check weddings table
    cursor.execute("PRAGMA table_info(weddings)")
    columns = [row[1] for row in cursor.fetchall()]
    print(f"\nWeddings Columns: {columns}")
    
    conn.close()
except Exception as e:
    print(f"Connection Error: {e}")
