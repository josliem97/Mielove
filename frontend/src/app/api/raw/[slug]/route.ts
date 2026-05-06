import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
    const slug = params.slug;
    try {
        // Fetch wedding data from backend
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}/weddings/slug/${slug}`, {
            cache: 'no-store'
        });
        
        if (!res.ok) {
            return new NextResponse('Wedding not found', { status: 404 });
        }
        
        const wedding = await res.json();
        
        // Read raw template
        const templatePath = path.join(process.cwd(), 'public', 'templates', 'miu_raw.html');
        if (!fs.existsSync(templatePath)) {
             return new NextResponse('Template file not found', { status: 404 });
        }
        
        let html = fs.readFileSync(templatePath, 'utf8');
        
        // Inject data into HTML
        const groomName = wedding.groom_name || 'ANH QUÂN';
        const brideName = wedding.bride_name || 'KHÁNH LINH';
        const dateStr = wedding.wedding_date || '31-12-2026'; // e.g. 15-05-2027
        
        // Parse date for Miu template segments
        const parts = dateStr.split(/[-/]/);
        const day = parts[0] || '31';
        const month = parts[1] || '12';
        const yearBase = parts[2] || '2026';
        const shortYear = yearBase.slice(-2);
        
        // String Replacements
        // Title & Meta
        html = html.replace(/Anh Quân &amp; Khánh Linh/g, `${groomName} &amp; ${brideName}`);
        
        // Main texts
        html = html.replace(/ANH QUÂN/g, groomName.toUpperCase());
        html = html.replace(/KHÁNH LINH/g, brideName.toUpperCase());
        html = html.replace(/Anh Quân/g, groomName);
        html = html.replace(/Khánh Linh/g, brideName);
        
        // Dates (Targeting specific hardcoded nodes in the HTML)
        html = html.replace(/>31</g, `>${day}<`);
        html = html.replace(/>12</g, `>${month}<`);
        html = html.replace(/>26</g, `>${shortYear}<`);
        html = html.replace(/>2026</g, `>${yearBase}<`);
        html = html.replace(/31-12-2026/g, `${day}-${month}-${yearBase}`);
        html = html.replace(/2026-12-31/g, `${yearBase}-${month}-${day}`);
        html = html.replace(/31\/12\/2026/g, `${day}/${month}/${yearBase}`);
        
        // Proxy static assets directly from miuwedding to prevent 404s
        html = html.replace(/(src|href|url)\s*=\s*(["'])\/(uploads|elements|assets)\//g, `$1=$2https://miuwedding.com/$3/`);
        html = html.replace(/url\(\/(uploads|elements|assets)\//g, `url(https://miuwedding.com/$1/`);
        
        return new NextResponse(html, {
            headers: {
                'Content-Type': 'text/html; charset=utf-8',
                'Cache-Control': 'public, max-age=0, must-revalidate',
            }
        });
    } catch (e) {
        console.error("Error serving raw HTML", e);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
