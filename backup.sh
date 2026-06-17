#!/usr/bin/env bash
# ============================================================
#  backup.sh - Backup automatico de la base de datos (Linux/macOS)
#  Pensado para ejecutarse de forma programada con Crontab.
#  No es interactivo: ideal para tareas agendadas.
# ============================================================
set -e

# Posicionarse en la carpeta del script (importante al correr desde crontab)
cd "$(dirname "$0")"

STAMP=$(date +%Y%m%d_%H%M%S)
OUT_DIR="backups"

mkdir -p "$OUT_DIR"

echo "[backup] Generando dump de PostgreSQL..."
docker compose exec -T db pg_dump -U shop shop > "$OUT_DIR/shop_${STAMP}.sql"

echo "[backup] Listo: $OUT_DIR/shop_${STAMP}.sql"
