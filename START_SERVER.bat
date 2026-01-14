@echo off
title Angular Development Server - Bahrain Chamber App
color 0A
echo ========================================
echo   Bahrain Chamber Event Management
echo   Angular Development Server
echo ========================================
echo.
echo Starting server on http://localhost:4200
echo.
echo Keep this window open while using the app.
echo Press Ctrl+C to stop the server.
echo.
cd /d "%~dp0"
call npm start
pause
