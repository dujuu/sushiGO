# Backend SushiGo (Laravel API)

API Laravel para catálogo, promociones, órdenes y autenticación con Sanctum.

## Requisitos de producción

- PHP 8.3+
- Composer 2+
- Base de datos (SQLite/MySQL/PostgreSQL/SQL Server)
- Extensiones PHP según motor de DB (`pdo_sqlite`, `pdo_mysql`, `pdo_pgsql`, `pdo_sqlsrv`)
- Worker de colas si `QUEUE_CONNECTION` no es `sync`

## Variables críticas de entorno

Mínimas para producción:

- `APP_ENV=production`
- `APP_DEBUG=false`
- `APP_URL=https://api-demo.tu-dominio.com`
- `FRONTEND_URL=https://demo.tu-dominio.com`
- `DB_CONNECTION=...`
- `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`
- `CORS_ALLOWED_ORIGINS=https://demo.tu-dominio.com`
- `SANCTUM_STATEFUL_DOMAINS=demo.tu-dominio.com`
- `LOG_CHANNEL=stderr` (recomendado en contenedor)
- `CACHE_STORE=database|redis`
- `QUEUE_CONNECTION=database|redis`
- `SESSION_DRIVER=database|redis`

## Checklist de despliegue

1. Instalar dependencias:

```bash
composer install --no-dev --optimize-autoloader
```

2. Configurar `.env` productivo.
3. Generar llave:

```bash
php artisan key:generate --force
```

4. Ejecutar migraciones:

```bash
php artisan migrate --force
```

5. Publicar symlink de storage (si usas archivos públicos):

```bash
php artisan storage:link
```

6. Cachear configuración/rutas/eventos:

```bash
php artisan config:cache
php artisan route:cache
php artisan event:cache
```

7. Levantar worker de colas (si aplica):

```bash
php artisan queue:work --tries=3 --timeout=90
```

## Notas de despliegue (Render/VPS)

- Render/VPS con Laravel funciona bien con MySQL/PostgreSQL.
- SQL Server requiere runtime con drivers `msodbcsql` + `pdo_sqlsrv`, lo que aumenta complejidad operativa.
- Si priorizas menor fricción de operación y costo, PostgreSQL suele ser la opción más directa.

## Verificación post-deploy

- `GET /api/v1/health`
- login admin
- CRUD productos/promociones
- creación de orden
- CORS desde frontend desplegado
- logs y colas sin errores
