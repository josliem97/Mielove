import sqlite3
import json
import os

# Connect to the correct database
db_path = "backend/mielove.db"
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Read the generated config
with open('hoa_moc_xanh_config.json', 'r', encoding='utf-8') as f:
    config_data = json.load(f)

# Define template metadata
template_name = "Hoa Mộc Xanh"
thumbnail_url = "/templates/hoa-moc-xanh/flower.webp" 
category = "Boho Floral"

# Check if already exists to update or insert
cursor.execute("SELECT id FROM templates WHERE name = ?", (template_name,))
row = cursor.fetchone()

if row:
    cursor.execute("""
        UPDATE templates 
        SET config_data = ?, thumbnail_url = ?, category = ?
        WHERE name = ?
    """, (json.dumps(config_data), thumbnail_url, category, template_name))
else:
    cursor.execute("""
        INSERT INTO templates (name, category, thumbnail_url, config_data)
        VALUES (?, ?, ?, ?)
    """, (template_name, category, thumbnail_url, json.dumps(config_data)))

conn.commit()
conn.close()
