#!/usr/bin/env bash
# ============================================================
#  deploy.sh - Automatización Git + Docker (Linux / macOS)
#  Hace: git add -> commit -> push -> docker build -> docker up
# ============================================================
set -e

echo "============================================"
echo "  Deploy automatizado (Git + Docker)"
echo "============================================"

read -p "Mensaje de commit: " MSG
MSG=${MSG:-"Deploy automático"}

echo ""
echo "[1/5] git add ."
git add .

echo "[2/5] git commit"
git commit -m "$MSG" || echo "(sin cambios para commitear)"

echo "[3/5] git push"
git push

echo "[4/5] docker compose build"
docker compose build

echo "[5/5] docker compose up -d"
docker compose up -d

echo ""
echo "============================================"
echo "  Listo. App: http://localhost:5173"
echo "  API: http://localhost:8000"
echo "============================================"
