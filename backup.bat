@echo off
REM ============================================================
REM  backup.bat - Backup automatico de la base de datos (Windows)
REM  Pensado para ejecutarse de forma programada con el
REM  Programador de tareas de Windows.
REM  No es interactivo: ideal para tareas agendadas.
REM ============================================================
setlocal

REM Posicionarse en la carpeta del script (importante al correr como tarea programada)
cd /d "%~dp0"

REM Marca de tiempo independiente del idioma del sistema (YYYYMMDD_HHMMSS)
for /f %%i in ('powershell -NoProfile -Command "Get-Date -Format yyyyMMdd_HHmmss"') do set STAMP=%%i

if not exist backups mkdir backups

echo [backup] Generando dump de PostgreSQL...
docker compose exec -T db pg_dump -U shop shop > backups\shop_%STAMP%.sql
if errorlevel 1 goto error

echo [backup] Listo: backups\shop_%STAMP%.sql
goto end

:error
echo *** Error al generar el backup. Verifica que el contenedor 'db' este corriendo. ***

:end
endlocal
