Write-Host "Testing Signup..." -ForegroundColor Yellow
try {
    $signupResponse = Invoke-RestMethod -Uri "http://localhost:5000/auth/signup" `
    -Method POST `
    -Body (@{
        name="Aditya"
        email="aditya_test@example.com"
        password="Password123!"
    } | ConvertTo-Json) `
    -ContentType "application/json"

    Write-Host "Signup Success:" -ForegroundColor Green
    $signupResponse | ConvertTo-Json -Depth 8
}
catch {
    Write-Host "Signup Failed:" -ForegroundColor Red
    $_.Exception.Response
}

Write-Host "`nTesting Login..." -ForegroundColor Yellow
try {
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:5000/auth/login" `
    -Method POST `
    -Body (@{
        email="aditya_test@example.com"
        password="Password123!"
    } | ConvertTo-Json) `
    -ContentType "application/json"

    Write-Host "Login Success:" -ForegroundColor Green
    $loginResponse | ConvertTo-Json -Depth 8
}
catch {
    Write-Host "Login Failed:" -ForegroundColor Red
    $_.Exception.Response
}