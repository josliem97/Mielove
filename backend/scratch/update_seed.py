import re

file_path = "e:/VINFAST/Mielove/backend/scripts/seed_template_53.py"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Replace fonts
content = content.replace("'Alisheia'", "'Great Vibes', cursive")
content = content.replace("'Flavinda'", "'Cormorant Garamond', serif")
content = content.replace("'SVN Betalisa'", "'Playfair Display', serif")
content = content.replace("'Betalisa'", "'Playfair Display', serif")

# Replace names
content = content.replace(
    '"text": "Nhà trai: Ông Nguyễn Văn A & Bà Trần Thị B\\nNhà gái: Ông Lê Văn C & Bà Phạm Thị D\\n----\\nChúng con trân trọng kính mời quý khách đến dự lễ thành hôn của gia đình chúng con."',
    '"text": "Nhà trai: Ông {{groom_father}} & Bà {{groom_mother}}\\nNhà gái: Ông {{bride_father}} & Bà {{bride_mother}}\\n----\\nChúng con trân trọng kính mời quý khách đến dự lễ thành hôn của gia đình chúng con."'
)

# Add objectPosition top to images that could cut off heads
# Find all "objectFit": "cover" inside props and add "objectPosition": "top" if it's an image element we want to modify.
# Actually, it's safer to just regex replace `"objectFit": "cover"` with `"objectFit": "cover", "objectPosition": "top"`
# for ALL cover images except maybe hero_bg or map_bg. But since all are portraits, top is usually fine for people.
# Or better, let's target the exact ones.
target_ids = ["pa_main_img", "ev1_img", "ev_mid_img", "ev2_img", "cal_pola", "dc_img", "gm_img1", "gm_img2", "gm_img4", "gm_img5", "wish_pola", "bk_img", "ty_image"]

for tid in target_ids:
    # Find the line with this ID
    pattern = rf'("id":\s*"{tid}".*?"props":\s*{{.*?)"objectFit":\s*"cover"'
    content = re.sub(pattern, r'\1"objectFit": "cover", "objectPosition": "top"', content)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Updated seed_template_53.py")
