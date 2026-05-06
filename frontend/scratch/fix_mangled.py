import glob
import os
import re

files = glob.glob(r'e:\VINFAST\Mielove\frontend\src\**\*.ts*', recursive=True)

pattern = re.compile(r'(`\$\{process\.env\.NEXT_PUBLIC_API_URL \|\| (`\$\{process\.env\.NEXT_PUBLIC_API_URL \|\| ("\$\{process\.env\.NEXT_PUBLIC_API_URL \|\| "http://localhost:8000"\}")\}`")\}`|`\$\{process\.env\.NEXT_PUBLIC_API_URL \|\| "http://localhost:8000"\}` \+ (`\$\{process\.env\.NEXT_PUBLIC_API_URL \|\| "http://localhost:8000"\}` \+ (`\$\{process\.env\.NEXT_PUBLIC_API_URL \|\| "http://localhost:8000"\}` \+ "|`|')))')

# Actually, the string became horribly mangled. Let's just find `http://localhost:8000` and manually replace the lines or use a smarter regex.
# Let's just replace the whole mangled block with process.env.NEXT_PUBLIC_API_URL

for f in files:
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    if 'NEXT_PUBLIC_API_URL' in content:
        # Revert all NEXT_PUBLIC_API_URL things back to http://localhost:8000
        # Wait, the mangling is complex. Let's just use regex to replace anything resembling the mangled string.
        # Mangled 1: `${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || "${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}"}`"}`
        content = re.sub(r'`\$\{process\.env\.NEXT_PUBLIC_API_URL \|\| [^/]+', '`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}`', content)
        
        # Mangled 2: `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}` + `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}` + `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}` + "
        content = re.sub(r'(`\$\{process\.env\.NEXT_PUBLIC_API_URL[^`]+` \+ )+["\'`]', '`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}` + "', content)

        # Let's do a much simpler approach: read lines, if line has NEXT_PUBLIC_API_URL, we replace the whole mess.
        # Actually I can just write a script to find all files with NEXT_PUBLIC_API_URL and print them so I can fix them manually.
        
        with open(f, 'w', encoding='utf-8') as file:
            file.write(content)
        print(f"Fixed {f}")
