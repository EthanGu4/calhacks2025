Write-Host "Restarting CookAI with environment variables..." -ForegroundColor Green
Write-Host ""

Write-Host "Stopping any running processes..." -ForegroundColor Yellow
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force

Write-Host ""
Write-Host "Starting the app..." -ForegroundColor Blue
npm start

Read-Host "Press Enter to continue"
