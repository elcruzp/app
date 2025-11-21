@echo off
cd /d "%~dp0"
echo Iniciando backend en puerto 4000...
node -r dotenv/config index.js
pause
