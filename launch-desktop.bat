@echo off
title HermesShield DevSecOps IDE
echo ===================================================
echo     Launching HermesShield Sovereign Desktop IDE
echo ===================================================
echo.

cd /d "%~dp0"

:: 1. Check if backend is running on port 8000
netstat -ano | findstr ":8000" >nul
if %errorlevel% neq 0 (
    echo [1/2] Starting HermesShield Backend Engine on port 8000...
    if exist "backend\.venv\Scripts\python.exe" (
        start /b "" "backend\.venv\Scripts\python.exe" -m uvicorn backend.main:app --port 8000 --host 127.0.0.1
    ) else (
        start /b "" python -m uvicorn backend.main:app --port 8000 --host 127.0.0.1
    )
    timeout /t 3 /nobreak >nul
) else (
    echo [1/2] Backend Engine is already active on port 8000.
)

:: 2. Launch Desktop Window
echo [2/2] Opening HermesShield Desktop Application...
npx --yes electron ./desktop

echo.
echo Application closed.
