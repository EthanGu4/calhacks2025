Write-Host "Setting up Google Vision API for CookAI..." -ForegroundColor Green
Write-Host ""

Write-Host "1. Go to Google Cloud Console: https://console.cloud.google.com/" -ForegroundColor Yellow
Write-Host "2. Create a new project or select existing" -ForegroundColor Yellow
Write-Host "3. Enable Vision API: APIs & Services > Library > Cloud Vision API" -ForegroundColor Yellow
Write-Host "4. Create API Key: APIs & Services > Credentials > Create Credentials > API Key" -ForegroundColor Yellow
Write-Host "5. Copy the API key" -ForegroundColor Yellow
Write-Host ""

$apiKey = Read-Host "Enter your Google Vision API key"

Write-Host ""
Write-Host "Creating .env file..." -ForegroundColor Blue

"# Google Vision API Configuration" | Out-File -FilePath ".env" -Encoding UTF8
"REACT_APP_GOOGLE_VISION_API_KEY=$apiKey" | Out-File -FilePath ".env" -Append -Encoding UTF8
"REACT_APP_DEBUG_VISION=true" | Out-File -FilePath ".env" -Append -Encoding UTF8

Write-Host ""
Write-Host "✅ .env file created successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Now you can run: npm start" -ForegroundColor Cyan
Write-Host ""
Read-Host "Press Enter to continue"
