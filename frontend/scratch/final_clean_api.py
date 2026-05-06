import glob
import re

files = glob.glob(r'e:\VINFAST\Mielove\frontend\src\**\*.ts*', recursive=True)

for f in files:
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    # Reset all process.env... to localhost
    content = re.sub(r'[`\'"]\$\{process\.env\.NEXT_PUBLIC_API_URL \|\| [`\'"]http://localhost:8000[`\'"]\}[`\'"]', '"http://localhost:8000"', content)
    content = re.sub(r'\$\{process\.env\.NEXT_PUBLIC_API_URL \|\| "http://localhost:8000"\}', 'http://localhost:8000', content)
    content = content.replace('`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}`', '"http://localhost:8000"')
    
    # Specific bad strings from the output
    content = content.replace('`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}`/api', '`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api')
    content = content.replace('`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}`/api/v1', '`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/v1')
    
    # To be extremely safe, we just use regex to replace all nested API urls with just http://localhost:8000
    content = re.sub(r'(\`\$\{process\.env\.NEXT_PUBLIC_API_URL \|\| )+["\'`]http://localhost:8000["\'`](\}\`)+', '"http://localhost:8000"', content)
    content = re.sub(r'\`\$\{process\.env\.NEXT_PUBLIC_API_URL \|\| \`\$\{process\.env\.NEXT_PUBLIC_API_URL \|\| "http://localhost:8000"\}\`\}\`', '"http://localhost:8000"', content)
    
    with open(f, 'w', encoding='utf-8') as file:
        file.write(content)

    # Now carefully replace
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
        
    # Replace inside backticks: `http://localhost:8000/api` -> `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api`
    content = content.replace('http://localhost:8000', '${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}')
    
    # If it was a normal string, it is now " ${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"} "
    # We must convert it to a template string: ` ${...} `
    content = re.sub(r'["\']\$\{process\.env\.NEXT_PUBLIC_API_URL \|\| "http://localhost:8000"\}([^"\']*)["\']', r'`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}\1`', content)

    with open(f, 'w', encoding='utf-8') as file:
        file.write(content)
        
    print(f"Fixed {f}")
