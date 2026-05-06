import glob

files = glob.glob(r'e:\VINFAST\Mielove\frontend\src\**\*.ts*', recursive=True)

for f in files:
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()

    # The bad pattern is: `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}`/api/v1/templates/"
    # We want: `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/v1/templates/`
    
    # Let's just fix the specific bad combinations:
    content = content.replace('`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}`/api/v1/templates/"', '`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/v1/templates/`')
    content = content.replace('`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}`/api/v1/weddings/${params.slug}?t=${Date.now()}"', '`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/v1/weddings/${params.slug}?t=${Date.now()}`')
    content = content.replace('`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}`/api/v1/guests/rsvp/${guest.id}"', '`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/v1/guests/rsvp/${guest.id}`')
    
    # Generic fix for: `${...}`/api/..."
    import re
    # Match: `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}`/something"
    # Replace with: `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/something`
    content = re.sub(r'`\$\{process\.env\.NEXT_PUBLIC_API_URL \|\| "http://localhost:8000"\}\`(/[^"]*)"', r'`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}\1`', content)
    
    # If there are any `...`/something' (single quote)
    content = re.sub(r'`\$\{process\.env\.NEXT_PUBLIC_API_URL \|\| "http://localhost:8000"\}\`(/[^\']*)\'', r'`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}\1`', content)

    with open(f, 'w', encoding='utf-8') as file:
        file.write(content)
