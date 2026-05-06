import database, models, json
import os

def insert_template():
    config_path = r"C:\Users\Admin\.gemini\antigravity\brain\68553329-2ebf-4ca0-bfcd-ce5ff7e35ce2\scratch\template_config.json"
    with open(config_path, "r", encoding="utf-8") as f:
        config_data = json.load(f)

    db = next(database.get_db())

    # Create Template
    template = models.Template(
        name='Thanh Sơn - Diệu Nhi',
        thumbnail_url='/templates/thanh-son-dieu-nhi/uploads/69b95065dcc4597893deb84b/1773752594568-1768964174030-615120422_925471073144357_5596178545909683221_n-cropped.webp',
        config_data=config_data,
        category='Premium'
    )
    db.add(template)
    db.commit()
    db.refresh(template)

    # Create or Update a Demo Wedding for this template
    wedding = db.query(models.Wedding).filter(models.Wedding.slug == 'thanh-son-dieu-nhi-demo').first()
    if wedding:
        wedding.template_id = template.id
        wedding.config_data = config_data
        print(f'Wedding updated with Slug: {wedding.slug}')
    else:
        wedding = models.Wedding(
            owner_id=1,
            template_id=template.id,
            slug='thanh-son-dieu-nhi-demo',
            groom_name='Thanh Sơn',
            bride_name='Diệu Nhi',
            wedding_date='2026-12-31',
            location='43A ngõ 26 Phạm Ngọc Thạch, Đống Đa, Hà Nội',
            config_data=config_data
        )
        db.add(wedding)
        print(f'Wedding created with Slug: thanh-son-dieu-nhi-demo')
    
    db.commit()
    print(f'Wedding updated with Height: {config_data["canvas"]["height"]}')
    print(f'Template created with ID: {template.id}')

if __name__ == "__main__":
    insert_template()
