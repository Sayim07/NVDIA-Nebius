@echo off
title Build HermesShield Windows Installer
echo =========================================================
echo    Building HermesShield Windows Standalone Installer
echo =========================================================
echo.

cd /d "%~dp0\desktop"

echo Installing electron-builder packaging dependencies...
call npm install --save-dev electron-builder electron

echo.
echo Packaging Windows .exe installer and portable executable...
call npx electron-builder --win

echo.
echo =========================================================
echo Build complete! Check the output installer in:
echo   desktop\dist\
echo =========================================================
pause
