import sqlite3

def cleanup():
    conn = sqlite3.connect('mielove.db')
    cur = conn.cursor()
    
    targets = [
        "Classic Elegance",
        "Modern Minimalist",
        "Vintage Gold",
        "Royal Burgundy (Signature)"
    ]
    
    for name in targets:
        cur.execute("DELETE FROM templates WHERE name = ?", (name,))
        print(f"Deleted template: {name}")
        
    conn.commit()
    conn.close()
    print("Cleanup complete.")

if __name__ == "__main__":
    cleanup()
