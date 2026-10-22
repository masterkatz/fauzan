@echo off
REM Double-click fail ni untuk run setup-pc.ps1 (letak dalam folder yang sama)
cd /d "%~dp0"
powershell -NoProfile -ExecutionPolicy Bypass -Command "Unblock-File -Path '.\setup-pc.ps1'; & '.\setup-pc.ps1'"
echo.
pause
