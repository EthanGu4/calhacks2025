@echo off
echo Restarting CookAI with environment variables...
echo.

echo Stopping any running processes...
taskkill /f /im node.exe 2>nul

echo.
echo Starting the app...
npm start

pause
