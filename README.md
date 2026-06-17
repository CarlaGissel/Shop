# Shop - Tienda de ropa full-stack

Aplicación de e-commerce de indumentaria con catálogo, carrito, checkout, autenticación y panel de administración. El backend expone una API REST con Laravel y el frontend es una SPA hecha con React + Vite.

## Despliegue en la nube

La aplicación está publicada en:

- **Frontend:** _pendiente de publicar_ <!-- TODO: pegar aquí la URL del despliegue (Vercel / Netlify / Render) -->
- **Backend (API):** _pendiente de publicar_ <!-- TODO: pegar aquí la URL de la API desplegada -->

## Stack

| Capa | Tecnología |
| --- | --- |
| Backend | PHP 8.3, Laravel 13, Laravel Sanctum |
| Frontend | React 19, Vite 8, Tailwind CSS 4, React Router, Axios |
| Base de datos | PostgreSQL en Docker. En local también puede usarse SQLite, MySQL o PostgreSQL |
| Contenedores | Docker, Docker Compose, nginx |

## Estructura del proyecto

```text
Shop/
├── Shop/                 # Backend Laravel
│   ├── app/
│   ├── database/
│   ├── routes/api.php
│   ├── Dockerfile
│   └── docker-entrypoint.sh
├── shop-frontend/        # Frontend React + Vite
│   ├── src/
│   ├── Dockerfile
│   └── nginx.conf
├── docker-compose.yml    # PostgreSQL + API + frontend
├── deploy.bat            # Automatización de despliegue (Windows)
├── deploy.sh             # Automatización de despliegue (Linux/macOS)
├── backup.bat            # Backup programado de la BD (Windows)
├── backup.sh             # Backup programado de la BD (Linux/macOS)
└── backups/              # Dumps generados por el backup
```

## Requisitos

Para ejecutar con Docker:

- Git
- Docker Desktop o Docker Engine
- Docker Compose v2

Para ejecutar sin Docker:

- PHP 8.3 o superior
- Composer 2
- Node.js 18 o superior
- npm
- SQLite, PostgreSQL o MySQL

## Instalación desde cero

### 1. Clonar el repositorio

```bash
git clone https://github.com/CarlaGissel/Shop.git
cd Shop
```

Si usas otro remoto, reemplaza la URL por la de tu repositorio.

### 2. Elegir modo de ejecución

Puedes levantar el proyecto de dos formas:

- **Docker**, recomendado para montar todo rápidamente con PostgreSQL incluido.
- **Local**, útil si quieres desarrollar backend y frontend por separado.

## Opción A: montar con Docker

Desde la raíz del proyecto, donde está `docker-compose.yml`, ejecuta:

```bash
docker compose build
docker compose up -d
```

Docker Compose levanta tres servicios:

| Servicio | Descripción | URL / puerto |
| --- | --- | --- |
| `db` | PostgreSQL 16 | Puerto interno `5432` |
| `backend` | API Laravel | http://localhost:8000 |
| `frontend` | React compilado servido por nginx | http://localhost:5173 |

El backend espera a que PostgreSQL esté disponible, crea el archivo `.env` dentro del contenedor si hace falta, genera `APP_KEY`, ejecuta migraciones y carga datos de ejemplo.

Abre la app en:

```text
http://localhost:5173
```

La API queda disponible en:

```text
http://localhost:8000/api
```

### Comandos útiles de Docker

```bash
docker compose ps
docker compose logs -f
docker compose logs -f backend
docker compose logs -f frontend
docker compose down
```

Para borrar también la base de datos y empezar completamente limpio:

```bash
docker compose down -v
docker compose up -d --build
```

### Ejecutar comandos dentro del backend

```bash
docker compose exec backend php artisan migrate:fresh --seed
docker compose exec backend php artisan test
docker compose exec backend php artisan tinker
```

### Ejecutar comandos dentro de PostgreSQL

```bash
docker compose exec db psql -U shop -d shop
```

Credenciales usadas por Docker:

```env
DB_CONNECTION=pgsql
DB_HOST=db
DB_PORT=5432
DB_DATABASE=shop
DB_USERNAME=shop
DB_PASSWORD=secret
```

## Opción B: montar en local sin Docker

En este modo se levantan dos servidores: Laravel en `localhost:8000` y Vite en `localhost:5173`.

### 1. Configurar backend

```bash
cd Shop
composer install
cp .env.example .env
php artisan key:generate
```

#### Usar SQLite rápido

SQLite es la opción más simple para desarrollo local.

En Linux/macOS:

```bash
touch database/database.sqlite
```

En Windows PowerShell:

```powershell
New-Item database/database.sqlite -ItemType File -Force
```

Luego verifica en `Shop/.env`:

```env
DB_CONNECTION=sqlite
```

Si `DB_DATABASE` aparece configurado con otro valor, puedes quitarlo o apuntarlo a `database/database.sqlite`.

#### Usar PostgreSQL o MySQL local

Edita `Shop/.env` con tus datos reales. Ejemplo para PostgreSQL:

```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=shop
DB_USERNAME=shop
DB_PASSWORD=secret
```

Después ejecuta migraciones y seeders:

```bash
php artisan migrate --seed
php artisan serve
```

La API queda en:

```text
http://localhost:8000/api
```

### 2. Configurar frontend

Abre otra terminal desde la raíz del proyecto:

```bash
cd shop-frontend
npm install
npm run dev
```

La app queda en:

```text
http://localhost:5173
```

Durante el desarrollo, Vite reenvía las llamadas a `/api` hacia `http://localhost:8000`, así que Laravel debe estar corriendo al mismo tiempo.

## Usuarios de prueba

El seeder crea estas cuentas:

| Rol | Email | Contraseña |
| --- | --- | --- |
| Administrador | `admin@shop.com` | `password` |
| Cliente | `cliente@shop.com` | `password` |

El panel de administración está disponible en `/admin` y solo puede entrar el usuario administrador.

## Funcionalidades principales

- Catálogo de productos con imágenes, stock, talles, colores y precios.
- Filtros por categoría y género.
- Búsqueda de productos.
- Ordenamiento por fecha y precio.
- Carrito persistente en el navegador.
- Checkout con creacion de pedido y descuento de stock.
- Registro, login, logout y sesión con tokens de Laravel Sanctum.
- Panel admin para productos, categorías, órdenes y usuarios.

## Endpoints principales

Base de la API:

```text
http://localhost:8000/api
```

### Públicos

| Método | Ruta | Descripción |
| --- | --- | --- |
| `GET` | `/products` | Lista productos. Soporta `search`, `category`, `gender` y `sort` |
| `GET` | `/products/{id}` | Muestra un producto |
| `GET` | `/categories` | Lista categorías |
| `POST` | `/auth/register` | Registra un usuario |
| `POST` | `/auth/login` | Inicia sesión |

### Usuario autenticado

Requieren token Bearer de Sanctum.

| Método | Ruta | Descripción |
| --- | --- | --- |
| `GET` | `/auth/me` | Devuelve el usuario actual |
| `POST` | `/auth/logout` | Cierra sesión |
| `GET` | `/orders` | Lista pedidos del usuario |
| `POST` | `/orders` | Crea un pedido |
| `GET` | `/orders/{id}` | Muestra un pedido |

### Administrador

Requieren usuario autenticado con rol `admin`.

| Método | Ruta | Descripción |
| --- | --- | --- |
| `GET` | `/admin/products` | Lista productos para administración |
| `POST` | `/admin/products` | Crea producto |
| `PUT/PATCH` | `/admin/products/{id}` | Actualiza producto |
| `DELETE` | `/admin/products/{id}` | Elimina producto |
| `POST` | `/admin/categories` | Crea categoría |
| `PUT/PATCH` | `/admin/categories/{id}` | Actualiza categoría |
| `DELETE` | `/admin/categories/{id}` | Elimina categoría |
| `GET` | `/admin/orders` | Lista ordenes |
| `PATCH` | `/admin/orders/{id}/status` | Cambia estado de orden |
| `GET` | `/admin/users` | Lista usuarios |
| `POST` | `/admin/users` | Crea usuario |
| `PATCH` | `/admin/users/{id}/role` | Cambia rol |
| `DELETE` | `/admin/users/{id}` | Elimina usuario |

## Scripts útiles

Backend, dentro de `Shop/`:

```bash
php artisan serve
php artisan migrate
php artisan migrate:fresh --seed
php artisan test
php artisan tinker
```

Frontend, dentro de `shop-frontend/`:

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

Docker, desde la raíz:

```bash
docker compose up -d --build
docker compose down
docker compose down -v
```

## Scripts de despliegue

El proyecto incluye scripts que automatizan:

```text
git add -> git commit -> git push -> docker compose build -> docker compose up -d
```

Windows:

```bat
deploy.bat
```

Linux/macOS:

```bash
chmod +x deploy.sh
./deploy.sh
```

Usalos solo cuando quieras guardar cambios en Git, subirlos al remoto y reconstruir Docker en una sola accion.

## Automatización programada (Plan B)

Como alternativa a ejecutar los scripts a mano, el proyecto incluye un script de
**backup automático de la base de datos** pensado para correr de forma programada.
No es interactivo, así que sirve tanto para el **Programador de tareas de Windows**
como para **Crontab** en Linux/macOS.

El script hace un `pg_dump` del contenedor `db` y lo guarda con fecha y hora en la
carpeta `backups/`:

```text
backups/shop_AAAAMMDD_HHMMSS.sql
```

Requisito: los contenedores deben estar levantados (`docker compose up -d`).

### Windows: Programador de tareas

Probar el script manualmente:

```bat
backup.bat
```

Crear una tarea programada que lo ejecute todos los días a las 23:00
(ejecutar en una consola como administrador, desde la raíz del proyecto):

```bat
schtasks /Create /SC DAILY /TN "ShopBackup" /TR "%CD%\backup.bat" /ST 23:00
```

Para ejecutarla manualmente o eliminarla:

```bat
schtasks /Run /TN "ShopBackup"
schtasks /Delete /TN "ShopBackup" /F
```

También se puede crear desde la interfaz gráfica: **Programador de tareas → Crear
tarea básica → Diariamente → Iniciar un programa → seleccionar `backup.bat`**.

### Linux/macOS: Crontab

Probar el script manualmente:

```bash
chmod +x backup.sh
./backup.sh
```

Editar la tabla de tareas:

```bash
crontab -e
```

Agregar una línea para ejecutar el backup todos los días a las 23:00
(reemplazar la ruta por la del proyecto):

```cron
0 23 * * * cd /ruta/al/proyecto/Shop && ./backup.sh >> backups/cron.log 2>&1
```

Verificar las tareas programadas:

```bash
crontab -l
```

> **Evidencia:** las capturas del Programador de tareas / `crontab -l` y de los
> archivos generados en `backups/` están en la sección
> [Capturas y evidencias](#capturas-y-evidencias).

## Capturas y evidencias

> Agregar aquí las capturas de pantalla como evidencia para la entrega.

### Aplicación funcionando

<!-- TODO: captura del frontend (catálogo, carrito o checkout) -->

### Docker

<!-- TODO: captura de `docker compose build` (construcción de las imágenes) -->
<!-- TODO: captura de `docker compose ps` (contenedores en ejecución) -->

### Automatización programada

<!-- TODO: captura del Programador de tareas de Windows o de `crontab -l` -->
<!-- TODO: captura de los archivos generados dentro de backups/ -->

## Solución de problemas

### El frontend abre, pero la API falla

Revisa que el backend este corriendo:

```bash
docker compose ps
docker compose logs -f backend
```

En local, confirma que `php artisan serve` este activo en `http://localhost:8000`.

### Quiero reiniciar los datos de ejemplo

Con Docker:

```bash
docker compose exec backend php artisan migrate:fresh --seed
```

En local:

```bash
cd Shop
php artisan migrate:fresh --seed
```

### Cambie migraciones o dependencias y Docker no refleja cambios

Reconstruye las imágenes:

```bash
docker compose down
docker compose build --no-cache
docker compose up -d
```

### El puerto 5173 u 8000 ya está ocupado

Deten el proceso que usa el puerto o cambia el mapeo en `docker-compose.yml`:

```yaml
ports:
  - "5174:80"
```

En ese ejemplo, el frontend quedaria en `http://localhost:5174`.

## Notas para desarrollo

- El frontend usa `baseURL: '/api'` en Axios.
- En Docker, nginx reenvía `/api/` al contenedor `backend:8000`.
- En local, Vite reenvía `/api` hacia `http://localhost:8000`.
- La base Docker persiste en el volumen `dbdata`.
- Para un entorno limpio de Docker, usa `docker compose down -v`.
