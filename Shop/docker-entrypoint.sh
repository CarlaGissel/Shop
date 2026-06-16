#!/bin/sh
set -e

# 1) Crear el archivo .env si no existe (a partir del ejemplo)
if [ ! -f .env ]; then
  cp .env.example .env
fi

# 2) Escribir la config de la base en el .env.
#    `php artisan serve` no propaga las variables DB_* del entorno a su
#    subproceso web, así que deben quedar en el propio archivo .env.
set_env() {
  key="$1"; value="$2"
  if grep -q "^${key}=" .env; then
    sed -i "s#^${key}=.*#${key}=${value}#" .env
  else
    echo "${key}=${value}" >> .env
  fi
}
set_env DB_CONNECTION "${DB_CONNECTION}"
set_env DB_HOST "${DB_HOST}"
set_env DB_PORT "${DB_PORT}"
set_env DB_DATABASE "${DB_DATABASE}"
set_env DB_USERNAME "${DB_USERNAME}"
set_env DB_PASSWORD "${DB_PASSWORD}"

# 3) Generar APP_KEY solo si todavía no hay una
if ! grep -q "^APP_KEY=base64:" .env; then
  php artisan key:generate --force
fi

# 3) Esperar a que PostgreSQL esté disponible
echo "Esperando a PostgreSQL en ${DB_HOST}:${DB_PORT}..."
until php -r "new PDO('pgsql:host=${DB_HOST};port=${DB_PORT};dbname=${DB_DATABASE}', '${DB_USERNAME}', '${DB_PASSWORD}');" >/dev/null 2>&1; do
  sleep 2
done
echo "PostgreSQL disponible."

# 4) Migraciones + datos de ejemplo
php artisan migrate --seed --force

# 5) Levantar la API
echo "Iniciando API en http://0.0.0.0:8000"
exec php artisan serve --host=0.0.0.0 --port=8000
