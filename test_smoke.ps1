# Smoke test: Register, Login, Fetch Weddings, Create Wedding
$API = "https://mielove.onrender.com/api/v1"
$ORIGIN = "https://mielove.vercel.app"
$headers = @{ Origin = $ORIGIN }

Write-Host "=== 1. REGISTER ===" -ForegroundColor Cyan
try {
    $body = @{ email = "smoketest999@mielove.vn"; username = "smoketest999"; password = "Test1234!" } | ConvertTo-Json
    $reg = Invoke-RestMethod -Uri "$API/auth/register" -Method POST -ContentType "application/json" -Body $body -Headers $headers
    Write-Host "Register OK: $($reg.username)" -ForegroundColor Green
} catch {
    Write-Host "Register Error: $($_.Exception.Message) | $($_.ErrorDetails.Message)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=== 2. LOGIN ===" -ForegroundColor Cyan
try {
    $loginBody = "username=smoketest999&password=Test1234!"
    $login = Invoke-RestMethod -Uri "$API/auth/login" -Method POST -ContentType "application/x-www-form-urlencoded" -Body $loginBody -Headers $headers
    $token = $login.access_token
    Write-Host "Login OK. Token starts: $($token.Substring(0, [Math]::Min(30, $token.Length)))..." -ForegroundColor Green
} catch {
    Write-Host "Login Error (user may not exist - register first): $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Try registering from the website: https://mielove.vercel.app/auth/register" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "=== 3. GET WEDDINGS (me) ===" -ForegroundColor Cyan
try {
    $authHeaders = @{ Origin = $ORIGIN; Authorization = "Bearer $token" }
    $weddings = Invoke-RestMethod -Uri "$API/weddings/me" -Method GET -Headers $authHeaders
    Write-Host "Weddings OK. Count: $($weddings.Count)" -ForegroundColor Green
} catch {
    Write-Host "Weddings Error: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== 4. GET TEMPLATES ===" -ForegroundColor Cyan
try {
    $templates = Invoke-RestMethod -Uri "$API/templates/" -Method GET -Headers $headers
    Write-Host "Templates OK. Count: $($templates.Count)" -ForegroundColor Green
    $templates | ForEach-Object { Write-Host "  - [$($_.id)] $($_.name)" }
} catch {
    Write-Host "Templates Error: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== 5. CREATE WEDDING ===" -ForegroundColor Cyan
try {
    $authHeaders = @{ Origin = $ORIGIN; Authorization = "Bearer $token" }
    $slug = "smoketest-$(Get-Date -Format 'yyyyMMddHHmmss')"
    $weddingBody = @{
        slug = $slug
        groom_name = "Anh Test"
        bride_name = "Em Test"
        wedding_date = "2026-12-31"
        template_id = 1
    } | ConvertTo-Json
    $wedding = Invoke-RestMethod -Uri "$API/weddings/" -Method POST -ContentType "application/json" -Body $weddingBody -Headers $authHeaders
    Write-Host "Create Wedding OK. ID: $($wedding.id), Slug: $($wedding.slug)" -ForegroundColor Green
} catch {
    Write-Host "Create Wedding Error: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== ALL TESTS DONE ===" -ForegroundColor Cyan
