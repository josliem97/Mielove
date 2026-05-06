
def get_masonry_layout():
    images = [
        "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=2069",
        "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2070",
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1976",
        "https://images.unsplash.com/photo-1550005814-386817036737?q=80&w=1974",
        "https://images.unsplash.com/photo-1522673607200-1648832cee98?q=80&w=2070",
        "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070",
        "https://images.unsplash.com/photo-1465495910483-0d674577da09?q=80&w=2070",
        "https://images.unsplash.com/photo-1460364155655-96d9cf1d7252?q=80&w=2070",
        "https://images.unsplash.com/photo-1518049362265-d5b2a6467637?q=80&w=2070",
        "https://images.unsplash.com/photo-1507504031003-b417219a0fde?q=80&w=2070",
        "https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=2070",
        "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=2070"
    ]
    
    canvas_w = 500
    base_x = 37
    base_y = 3850
    gap = 16
    col_w = (canvas_w - 11 * gap) / 12
    row_h = 150
    
    # Grid state: occupied[row][col]
    grid = [[False for _ in range(12)] for _ in range(50)]
    
    components = []
    
    for i, img in enumerate(images):
        is_wide = (i % 5 == 0)
        is_tall = (i % 3 == 0)
        
        span_w = 8 if is_wide else 4
        span_h = 2 if is_tall else 1
        
        # Find first available spot
        found = False
        for r in range(50):
            for c in range(13 - span_w):
                # Check if fits
                fits = True
                for dr in range(span_h):
                    for dc in range(span_w):
                        if grid[r + dr][c + dc]:
                            fits = False
                            break
                    if not fits: break
                
                if fits:
                    # Occupy
                    for dr in range(span_h):
                        for dc in range(span_w):
                            grid[r + dr][c + dc] = True
                    
                    # Calculate real dimensions
                    x = base_x + c * (col_w + gap)
                    y = base_y + r * (row_h + gap)
                    w = span_w * col_w + (span_w - 1) * gap
                    h = span_h * row_h + (span_h - 1) * gap
                    
                    components.append({
                        "id": f"album_img_{i}",
                        "type": "element_image",
                        "x": round(x), "y": round(y), "w": round(w), "h": round(h), "z": 2,
                        "props": { "src": img, "objectFit": "cover", "borderRadius": 20 }
                    })
                    found = True
                    break
            if found: break
            
    import json
    print(json.dumps(components, indent=4))

if __name__ == "__main__":
    get_masonry_layout()
