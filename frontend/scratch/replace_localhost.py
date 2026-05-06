import glob
import os

files = glob.glob(r'e:\VINFAST\Mielove\frontend\src\**\*.ts*', recursive=True)

for f in files:
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    if 'http://localhost:8000' in content:
        # Replace and write back
        new_content = content.replace('"http://localhost:8000', '`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}` + "')
        new_content = new_content.replace('`http://localhost:8000', '`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}` + `')
        new_content = new_content.replace("'http://localhost:8000", '`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}` + \'')
        
        # specific fix for template strings that already use backticks
        # E.g. `http://localhost:8000/api/v1/...` -> `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/v1/...`
        # Wait, if we replace `http://localhost:8000 with `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"} then it works inside backticks!
        
        # Let's do a cleaner replacement:
        content = content.replace('"http://localhost:8000/', '`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/')
        # What if it doesn't end with slash?
        content = content.replace('"http://localhost:8000', '`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}`')
        
        # Inside backticks:
        content = content.replace('http://localhost:8000', '${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}')
        
        with open(f, 'w', encoding='utf-8') as file:
            file.write(content)
        print(f"Replaced in {f}")

print("Done replacing localhost")
