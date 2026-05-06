import glob

files = glob.glob(r'e:\VINFAST\Mielove\frontend\src\**\*.ts*', recursive=True)

for f in files:
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    if 'NEXT_PUBLIC_API_URL' in content:
        # We know we made a mess. Let's just find and replace the specific bad strings
        content = content.replace('`${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}` + "`}`"}/', '`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/')
        
        content = content.replace('`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}` + "`/api', '`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api')
        content = content.replace('`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}` + \'`/api', '`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api')
        content = content.replace('`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}` + "http://localhost:8000', '`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}')
        
        # It's easier to just find the exact mangled lines and replace them. Let's write the file back after fixing the most common ones.
        # Actually, let's just write a regex that matches ANY combination of process.env.NEXT_PUBLIC_API_URL that is nested
        import re
        content = re.sub(r'(\`\$\{process\.env\.NEXT_PUBLIC_API_URL \|\| )+["\'`]\$\{process\.env\.NEXT_PUBLIC_API_URL[^}]+\}[^/]+', '`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}`', content)
        content = re.sub(r'\$\{process\.env\.NEXT_PUBLIC_API_URL \|\| \$\{process\.env\.NEXT_PUBLIC_API_URL[^}]+\}', '${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}', content)
        content = re.sub(r'(\`\$\{process\.env\.NEXT_PUBLIC_API_URL \|\| "http://localhost:8000"\}\` \+ )+', '', content)
        
        # There's a simpler way: just reset all process.env.NEXT_PUBLIC_API_URL to http://localhost:8000 and start over!
        content = re.sub(r'[`\'"]\$\{process\.env\.NEXT_PUBLIC_API_URL \|\| ["\'`]http://localhost:8000["\'`]\}[`\'"]', '"http://localhost:8000"', content)
        content = re.sub(r'\$\{process\.env\.NEXT_PUBLIC_API_URL \|\| "http://localhost:8000"\}', 'http://localhost:8000', content)
        content = content.replace('`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}`', '"http://localhost:8000"')
        content = content.replace('`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}', 'http://localhost:8000')
        content = content.replace('${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}', 'http://localhost:8000')
        
        with open(f, 'w', encoding='utf-8') as file:
            file.write(content)
        print(f"Cleaned {f}")
