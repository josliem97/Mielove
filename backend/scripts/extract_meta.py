import re
import json

html_path = r'e:\VINFAST\Mielove\frontend\relative-recursive\miuwedding.com\anh-quan-khanh-linh-2026-12-31\index.html'

with open(html_path, 'r', encoding='windows-1258') as f:
    content = f.read()

# Pattern for canvas elements (more inclusive)
pattern = r'<div[^>]*data-node-id="([^"]+)"[^>]*data-node-type="([^"]+)"[^>]*style="([^"]+)"[^>]*>(.*?)</div>'
# Patterns for other tags that might have data-node-id (sections, etc)
pattern2 = r'<(section|button|div)[^>]*data-node-id="([^"]+)"[^>]*style="([^"]+)"[^>]*>(.*?)</\1>'

matches = re.finditer(pattern, content, re.DOTALL)
matches2 = re.finditer(pattern2, content, re.DOTALL)

nodes = []

def parse_node(node_id, node_type, style_str, inner_html, inner_html_full):
    styles = {}
    for part in style_str.split(';'):
        if ':' in part:
            pair = part.split(':', 1)
            if len(pair) == 2:
                k, v = pair
                styles[k.strip().lower()] = v.strip()

    try:
        x = float(styles.get('left', '0').replace('px', ''))
        y = float(styles.get('top', '0').replace('px', ''))
        w = float(styles.get('width', '0').replace('px', ''))
        h = float(styles.get('height', '0').replace('px', ''))
        z = int(styles.get('z-index', '0'))
    except:
        return None

    props = {}
    
    # Capture animations
    anim_match = re.search(r'data-anim-preset="([^"]+)"', inner_html_full)
    animation = None
    if anim_match:
        animation = {
            "preset": anim_match.group(1),
            "duration": int(re.search(r'data-anim-duration="(\d+)"', inner_html_full).group(1)) if re.search(r'data-anim-duration="(\d+)"', inner_html_full) else 1000,
            "delay": int(re.search(r'data-anim-delay="(\d+)"', inner_html_full).group(1)) if re.search(r'data-anim-delay="(\d+)"', inner_html_full) else 0,
            "easing": re.search(r'data-anim-easing="([^"]+)"', inner_html_full).group(1) if re.search(r'data-anim-easing="([^"]+)"', inner_html_full) else "ease-in-out"
        }

    if node_type == 'element_text':
        text = re.sub(r'<br\s*/?>', '\n', inner_html)
        text = re.sub(r'<[^>]+>', '', text)
        props["text"] = text.strip()
        fs_str = styles.get('font-size', '16').replace('px', '').split(' ')[0]
        try: props["fontSize"] = int(float(fs_str))
        except: props["fontSize"] = 16
        props["color"] = styles.get('color', '#000000')
        props["fontFamily"] = styles.get('font-family', '').split(',')[0].strip("'\" ")
        props["textAlign"] = styles.get('text-align', 'left')

    elif 'calendar' in node_id or 'calendar' in inner_html_full:
        node_type = 'element_calendar'
        props["date"] = "2026-12-31" # Default from reference
    
    elif 'countdown' in node_id or 'countdown' in inner_html_full:
        node_type = 'element_countdown'
        props["targetDate"] = "2026-12-31T09:00:00"

    elif node_type == 'element_image' or 'image' in node_id or 'element_box' in node_type:
        img_match = re.search(r'src="([^"]+)"', inner_html)
        if not img_match:
            img_match = re.search(r'background-image:\s*url\(([^)]+)\)', style_str)

        if img_match:
            raw_src = img_match.group(1).replace('"', '').replace("'", "")
            # Flatten: uploads/xxxid/filename.webp -> /images/templates/53/filename.webp
            # Also handle elements/ and ../ paths
            import os as _os
            filename = _os.path.basename(raw_src)
            if 'elements/' in raw_src:
                props["src"] = f"/images/templates/53/{filename}"
            elif 'uploads/' in raw_src:
                props["src"] = f"/images/templates/53/{filename}"
            else:
                props["src"] = raw_src.replace('../', '/images/templates/53/')
        elif 'signature-bg' in style_str:
            props["src"] = "/images/templates/53/signature-bg-red.png"
            
        node_type = 'element_image'

    return { "id": node_id, "type": node_type, "x": x, "y": y, "w": w, "h": h, "z": z, "props": props, "animation": animation }

for m in matches:
    n = parse_node(m.group(1), m.group(2), m.group(3), m.group(4), m.group(0))
    if n: nodes.append(n)

for m in matches2:
    nid = m.group(2)
    if any(n["id"] == nid for n in nodes): continue
    
    ntype = 'element_image' if 'image' in nid else ('element_album' if 'album' in nid else ('element_rsvp' if 'rsvp' in nid else ('element_wishes' if 'wishes' in nid else 'container')))
    n = parse_node(nid, ntype, m.group(3), m.group(4), m.group(0))
    if n: nodes.append(n)

# Save result
with open('extracted_meta.json', 'w', encoding='utf-8') as f:
    json.dump(nodes, f, indent=2, ensure_ascii=False)

print(f"Extracted {len(nodes)} nodes.")
