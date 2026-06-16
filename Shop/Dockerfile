# ===== Backend: API Laravel (PHP 8.3) =====
FROM php:8.3-cli

# Dependencias del sistema + extensiones PHP necesarias (PostgreSQL, zip, etc.)
RUN apt-get update && apt-get install -y \
        git \
        unzip \
        libpq-dev \
        libzip-dev \
    && docker-php-ext-install pdo pdo_pgsql zip \
    && rm -rf /var/lib/apt/lists/*

# Composer (copiado desde la imagen oficial)
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Instalar dependencias PHP primero (aprovecha la cache de Docker).
# Incluimos las de desarrollo porque el seeder usa Faker (fake()).
COPY composer.json composer.lock ./
RUN composer install --no-scripts --no-interaction --prefer-dist

# Copiar el resto del proyecto
COPY . .
RUN composer dump-autoload --optimize

# Entrypoint que prepara el entorno y arranca el servidor
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 8000
ENTRYPOINT ["docker-entrypoint.sh"]
