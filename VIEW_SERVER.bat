@echo off
title Angular Server - Compilation Status
color 0A
mode con: cols=120 lines=40
echo ========================================
echo   Angular Development Server
echo   Compilation Status
echo ========================================
echo.
echo Checking server status...
echo.
cd /d "%~dp0"
netstat -an | findstr ":4200 LISTENING" >nul
if %ERRORLEVEL% EQU 0 (
    echo [OK] Server is running on port 4200
    echo.
    echo To see live compilation output:
    echo 1. Check the CMD window running npm start
    echo 2. Or look at the terminal where you started the server
    echo.
) else (
    echo [ERROR] Server is not running on port 4200
    echo.
    echo Starting server now...
    echo.
    call npm start
)
pause
