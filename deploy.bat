@echo off
REM ============================================================
REM  deploy.bat - Automatizacion Git + Docker (Windows)
REM  Hace: git add -> commit -> push -> docker build -> docker up
REM ============================================================
setlocal

echo ============================================
echo   Deploy automatizado (Git + Docker)
echo ============================================

set /p MSG="Mensaje de commit: "
if "%MSG%"=="" set MSG=Deploy automatico

echo.
echo [1/5] git add .
git add .

echo [2/5] git commit
git commit -m "%MSG%"

echo [3/5] git push
git push

echo [4/5] docker compose build
docker compose build
if errorlevel 1 goto error

echo [5/5] docker compose up -d
docker compose up -d
if errorlevel 1 goto error

echo.
echo ============================================
echo   Listo. App: http://localhost:5173
echo   API: http://localhost:8000
echo ============================================
goto end

:error
echo.
echo *** Ocurrio un error en Docker. Revisa la salida de arriba. ***

:end
endlocal
