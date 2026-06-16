# 🛍️ Shop — Tienda de Ropa Full-Stack

Aplicación de e-commerce de indumentaria con catálogo, carrito, checkout y panel de
administración. Backend en **Laravel** (API REST) y frontend en **React + Vite**.

---

## ✨ Características

### Tienda (cliente)
- Catálogo de productos con imágenes, stock y precios en **guaraníes** (`Gs. 800.000`).
- Filtros por **categoría** (Abrigos, Camisetas, Pantalones, Accesorios) y por
  **sección/género** (Hombre, Mujer, Unisex).
- **Búsqueda** de productos insensible a mayúsculas/minúsculas.
- Ordenamiento por más recientes / menor precio / mayor precio.
- **Carrito** persistente (guardado en el navegador).
- **Checkout** completo: datos de contacto, dirección de envío y confirmación de pedido
  (descuenta stock automáticamente).
- **Cuenta de usuario**: menú desplegable con "Mi cuenta" y "Mis pedidos".

### Panel de administración
- **Dashboard** con métricas.
- **Productos**: alta, edición, activar/desactivar (con categoría y género).
- **Categorías**: gestión completa.
- **Órdenes**: listado y cambio de estado (pendiente → enviado → entregado, etc.).
- **Usuarios**: alta, cambio de rol (cliente/admin) y baja.

### Autenticación
- Registro e inicio de sesión con **tokens** (Laravel Sanctum).
- Rutas protegidas por rol (cliente / administrador).

---

## 🧱 Stack tecnológico

| Capa | Tecnologías |
|------|-------------|
| **Backend** | PHP 8.3+, Laravel 13, Laravel Sanctum |
| **Frontend** | React 19, Vite 8, Tailwind CSS 4, React Router 7, Axios |
| **Base de datos** | Compatible con Laravel (PostgreSQL / MySQL / SQLite) |

---

## 📁 Estructura del proyecto

```
Shop/
├── Shop/              # Backend — API REST en Laravel
│   ├── app/Http/Controllers/Api/
│   ├── database/migrations/
│   ├── database/seeders/
│   └── routes/api.php
└── shop-frontend/     # Frontend — SPA en React + Vite
    └── src/
        ├── components/   # Navbar, CartDrawer, ProductCard, ...
        ├── context/      # AuthContext, CartContext
        ├── pages/        # Home, Checkout, Orders, Account, admin/...
        └── api/axios.js
```

---

## 🚀 Puesta en marcha

### Requisitos previos
- PHP **8.3+** y [Composer](https://getcomposer.org/)
- [Node.js](https://nodejs.org/) **18+** y npm
- Una base de datos (PostgreSQL, MySQL o SQLite)

### 1. Backend (Laravel)

```bash
cd Shop

# Instalar dependencias
composer install

# Configurar entorno
cp .env.example .env
php artisan key:generate

# Editá el archivo .env con los datos de tu base de datos:
#   DB_CONNECTION=pgsql        (o mysql / sqlite)
#   DB_HOST=127.0.0.1
#   DB_PORT=5432
#   DB_DATABASE=shop
#   DB_USERNAME=...
#   DB_PASSWORD=...

# Crear tablas y datos de ejemplo
php artisan migrate --seed

# Levantar el servidor de la API (http://localhost:8000)
php artisan serve
```

### 2. Frontend (React + Vite)

En **otra terminal**:

```bash
cd shop-frontend

# Instalar dependencias
npm install

# Levantar el servidor de desarrollo (http://localhost:5173)
npm run dev
```

> El frontend hace proxy de las llamadas `/api` hacia `http://localhost:8000`,
> así que **ambos servidores deben estar corriendo** a la vez.

Abrí **http://localhost:5173** en el navegador.

---

## 👤 Usuarios de prueba

El seeder crea dos cuentas:

| Rol | Email | Contraseña |
|-----|-------|------------|
| Administrador | `admin@shop.com` | `password` |
| Cliente | `cliente@shop.com` | `password` |

> El panel de administración se accede desde el menú de cuenta (visible solo para admins)
> o entrando a `/admin`.

---

## 🔌 Endpoints principales de la API

Base: `http://localhost:8000/api`

### Públicos
| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/products` | Listado de productos (acepta `?search=`, `?category=`, `?gender=`, `?sort=`) |
| `GET` | `/products/{id}` | Detalle de un producto |
| `GET` | `/categories` | Listado de categorías |
| `POST` | `/auth/register` | Registro |
| `POST` | `/auth/login` | Inicio de sesión |

### Autenticados (token Sanctum)
| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/auth/me` | Datos del usuario actual |
| `POST` | `/auth/logout` | Cerrar sesión |
| `GET` | `/orders` | Pedidos del usuario |
| `POST` | `/orders` | Crear un pedido (checkout) |

### Administrador
| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET/POST/PUT/DELETE` | `/admin/products` | Gestión de productos |
| `GET/POST/PUT/DELETE` | `/admin/categories` | Gestión de categorías |
| `GET` · `PATCH` | `/admin/orders` · `/admin/orders/{id}/status` | Órdenes y cambio de estado |
| `GET/POST/PATCH/DELETE` | `/admin/users` | Gestión de usuarios |

---

## 🛠️ Scripts útiles

**Backend** (`Shop/`)
```bash
php artisan migrate:fresh --seed   # Reinicia la base de datos con datos de ejemplo
php artisan tinker                 # Consola interactiva
```

**Frontend** (`shop-frontend/`)
```bash
npm run dev       # Servidor de desarrollo
npm run build     # Compilación de producción
npm run lint      # Linter
```
