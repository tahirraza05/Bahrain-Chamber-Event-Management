@echo off
cd /d "%~dp0"
echo ========================================
echo Starting Angular Development Server
echo ========================================
echo.
echo This window will show compilation progress and errors.
echo Keep this window open while using the app.
echo.
echo Press Ctrl+C to stop the server.
echo.
pause
call npm start
