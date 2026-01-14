@echo off
cd /d "%~dp0"
echo Starting Angular Development Server...
echo.
call node_modules\.bin\ng.cmd serve --open
if errorlevel 1 (
    echo.
    echo Trying alternative method...
    call npm start
)
