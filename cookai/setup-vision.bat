@echo off
echo Setting up Google Vision API for CookAI...
echo.

echo 1. Go to Google Cloud Console: https://console.cloud.google.com/
echo 2. Create a new project or select existing
echo 3. Enable Vision API: APIs & Services > Library > Cloud Vision API
echo 4. Create API Key: APIs & Services > Credentials > Create Credentials > API Key
echo 5. Copy the API key
echo.

set /p API_KEY="Enter your Google Vision API key: "

echo.
echo Creating .env file...

echo # Google Vision API Configuration > .env
echo REACT_APP_GOOGLE_VISION_API_KEY=%API_KEY% >> .env
echo REACT_APP_DEBUG_VISION=true >> .env

echo.
echo ✅ .env file created successfully!
echo.
echo Now you can run: npm start
echo.
pause
