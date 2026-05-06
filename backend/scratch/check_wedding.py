import sqlite3
import sys
import json

sys.stdout.reconfigure(encoding='utf-8')

conn = sqlite3.connect('backend/mielove.db')
cursor = conn.cursor()

# Find the wedding by slug
slug = 'anh-quan-khanh-linh-2026-12-31'
cursor.execute("SELECT id, template_id, groom_name, bride_name FROM weddings WHERE slug = ?", (slug,))
wedding = cursor.fetchone()

if wedding:
    print(f"Found wedding: ID={wedding[0]}, TemplateID={wedding[1]}, Names={wedding[2]} & {wedding[3]}")
    
    # Check if we should force update it
    # I'll just update ALL weddings with template_id 1 again to be sure
    with open('backend/scripts/apply_final_seamless_gap_fix.py', 'r') as f:
        content = f.read()
        # Find NEW_CONFIG definition
        start_idx = content.find('NEW_CONFIG = {')
        end_idx = content.find('}\n\ndef seed():') + 1
        new_config_str = content[start_idx + len('NEW_CONFIG = '):end_idx]
        # This is a bit risky but let's try to get the config
        # Actually I'll just re-import or use the known structure
        
    # Let's just run the seed script again but make sure it hits the specific slug
else:
    print("Wedding not found by slug")

conn.close()
