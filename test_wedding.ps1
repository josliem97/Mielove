$API = "https://mielove.onrender.com/api/v1"

# Login
$login = Invoke-RestMethod -Uri "$API/auth/login" -Method POST -ContentType "application/x-www-form-urlencoded" -Body "username=smoketest999&password=Test1234!"
$token = $login.access_token
Write-Host "Token OK"

$slug = "smoke-$(Get-Date -Format 'yyyyMMddHHmmss')"
$wBody = @{slug=$slug; groom_name="Anh Test"; bride_name="Em Test"; wedding_date="2026-12-31"; template_id=1} | ConvertTo-Json

try {
    $result = Invoke-RestMethod -Uri "$API/weddings/" -Method POST `
        -ContentType "application/json" -Body $wBody `
        -Headers @{ Authorization="Bearer $token" }
    Write-Host "SUCCESS: Wedding ID=$($result.id)"
} catch [System.Net.WebException] {
    $resp = $_.Exception.Response
    if ($resp) {
        $stream = $resp.GetResponseStream()
        $reader = [System.IO.StreamReader]::new($stream)
        $body = $reader.ReadToEnd()
        Write-Host "HTTP $($resp.StatusCode.value__) Error:"
        Write-Host $body
    } else {
        Write-Host "No response: $_"
    }
}
