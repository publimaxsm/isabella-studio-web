@echo off
chcp 65001 >nul
title Isabella Studio - servidor local
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo.
  echo  No encontre Node.js en esta computadora.
  echo  Instala la version LTS desde https://nodejs.org y vuelve a abrir este archivo.
  start "" https://nodejs.org/
  pause
  exit /b 1
)

rem Se copia el proyecto fuera de OneDrive para que no sincronice miles de archivos de node_modules
set "DEST=%LOCALAPPDATA%\isabella-studio-dev"
echo.
echo  Preparando el proyecto en %DEST% ...
robocopy "%~dp0." "%DEST%" /E /XD node_modules .next out /XF iniciar-servidor.bat /NFL /NDL /NJH /NJS /NP >nul
cd /d "%DEST%"

if not exist node_modules (
  echo  Instalando dependencias - solo la primera vez, tarda 1 a 3 minutos...
  call npm install --no-audit --no-fund
  if errorlevel 1 (
    echo  Hubo un error instalando las dependencias.
    pause
    exit /b 1
  )
)

echo.
echo  ============================================================
echo    Isabella Studio corriendo en  http://localhost:3000
echo    Para apagarlo, cierra esta ventana o presiona Ctrl + C
echo  ============================================================
echo.
start "" cmd /c "timeout /t 8 >nul & start http://localhost:3000"
call npm run dev
pause
