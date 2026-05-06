import glob
import re

files = glob.glob(r'e:\VINFAST\Mielove\frontend\src\**\*.ts*', recursive=True)

for f in files:
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    original_content = content

    # Replace `"http://localhost:8000..."` or `'http://localhost:8000...'` with `` `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}...` ``
    # But ONLY if it's a string literal. If it's already inside a template literal, we just replace the substring.
    
    # 1. Inside template literals: `http://localhost:8000/api...` -> `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api...`
    content = content.replace('`http://localhost:8000', '`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}')
    
    # 2. String literals: "http://localhost:8000/api..." -> `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api...`
    # Replace `"http://localhost:8000` with `` `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"} ``
    # But wait, the closing quote of the string literal will remain.
    # For example: axios.get("http://localhost:8000/api") -> axios.get(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api") which is invalid JS!
    # So we must replace the whole string literal!
    content = re.sub(r'["\']http://localhost:8000([^"\']*)["\']', r'`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}\1`', content)
    
    if content != original_content:
        with open(f, 'w', encoding='utf-8') as file:
            file.write(content)
        print(f"Replaced properly in {f}")

print("Done")
