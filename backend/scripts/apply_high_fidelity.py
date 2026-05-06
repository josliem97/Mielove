import json
import sqlite3

# Load extracted meta
with open('extracted_meta.json', 'r', encoding='utf-8') as f:
    elements = json.load(f)

# Define the Master Config
master_config = {
    "canvas": {
        "width": 575,
        "height": 11005,
        "backgroundColor": "#fdfdfb",
        "backgroundImage": "/images/templates/53/background.jpg",
        "backgroundSize": "100% 100%",
        "musicUrl": "/audio/templates/53/young_and_beautiful.m4a",
        "elements": []
    }
}

# Mapping of original IDs to our block types if needed
# But for now we use the extracted types

# Add extracted elements
for el in elements:
    # Inject placeholders for names/dates in text
    if el["type"] == "element_text":
        text = el["props"].get("text", "")
        # Very specific replacement to match EXACT strings in HTML
        # Handling the corrupted versions if they exist, or the clean ones
        text = text.replace("ANH QUÂN", "{{groom_name|upper}}")
        text = text.replace("Anh Quân", "{{groom_name}}")
        text = text.replace("ANH QUÂN", "{{groom_name|upper}}") # Double check for variants
        
        text = text.replace("KHÁNH LINH", "{{bride_name|upper}}")
        text = text.replace("Khánh Linh", "{{bride_name}}")
        
        text = text.replace("31-12-2026", "{{wedding_date}}")
        el["props"]["text"] = text

    master_config["canvas"]["elements"].append(el)

# Debug: Print first 2 text nodes
text_nodes = [e for e in master_config["canvas"]["elements"] if e["type"] == "element_text"]
for i in range(min(2, len(text_nodes))):
    print(f"Node {i}: {text_nodes[i]['props'].get('text')}")

# Add missing decorative images (decor-flower1-4)
# I'll add them at logical positions based on the reference or my analysis
# For now, I'll stick to what was in the HTML as elements
# Actually, those were also in the HTML but my scraper might have missed them if they weren't data-node-type="element_text"
# Wait, I'll check if my scraper caught images.
image_elements = [e for e in elements if e["type"] == "element_image"]
print(f"Found {len(image_elements)} image elements.")

# Save to DB
db_path = r'e:\VINFAST\Mielove\backend\mielove.db'
conn = sqlite3.connect(db_path)
cur = conn.cursor()

config_json = json.dumps(master_config, ensure_ascii=False)
cur.execute('UPDATE templates SET config_data = ? WHERE id = 1', (config_json,))
conn.commit()
conn.close()

print("Template 1 updated with High-Fidelity Canvas Layout!")
