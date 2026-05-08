import sqlite3
import json
import os

db_path = "backend/mielove.db"

# List of slugs to update
slugs = ["thanh-son-dieu-nhi", "quang-huy-thao-uyen", "thanh-liem-tra-my"]

# New music URL (Beautiful wedding music)
new_music_url = "https://cdn.pixabay.com/audio/2022/05/27/audio_1808f3030e.mp3" 

def update_music():
    if not os.path.exists(db_path):
        print(f"Database not found at {db_path}")
        return

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    for slug in slugs:
        print(f"Updating music for: {slug}")
        # Update music_url column
        cursor.execute("UPDATE weddings SET music_url = ? WHERE slug = ?", (new_music_url, slug))
        
        # Also check if music is inside config_data json
        cursor.execute("SELECT config_data FROM weddings WHERE slug = ?", (slug,))
        row = cursor.fetchone()
        if row and row[0]:
            try:
                config = json.loads(row[0])
                config['music_url'] = new_music_url
                cursor.execute("UPDATE weddings SET config_data = ? WHERE slug = ?", (json.dumps(config), slug))
            except Exception as e:
                print(f"Error updating config_data for {slug}: {e}")

    conn.commit()
    print("Done!")
    conn.close()

if __name__ == "__main__":
    update_music()
