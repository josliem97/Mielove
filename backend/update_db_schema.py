import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()
DATABASE_URL = os.getenv('DATABASE_URL')

def update_db():
    try:
        conn = psycopg2.connect(DATABASE_URL)
        cur = conn.cursor()
        
        # Check if column exists
        cur.execute("SELECT column_name FROM information_schema.columns WHERE table_name='weddings' AND column_name='is_paid';")
        if not cur.fetchone():
            print('Adding is_paid and plan_type columns...')
            cur.execute("ALTER TABLE weddings ADD COLUMN is_paid BOOLEAN DEFAULT FALSE;")
            cur.execute("ALTER TABLE weddings ADD COLUMN plan_type VARCHAR DEFAULT 'free';")
            conn.commit()
            print('Database updated successfully!')
        else:
            print('Columns already exist.')
            
        cur.close()
        conn.close()
    except Exception as e:
        print(f'Error: {e}')

if __name__ == '__main__':
    update_db()
