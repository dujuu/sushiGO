# Frontend Sushi (Angular)

Arquitectura frontend profesional para tienda de sushi (cliente invitado), preparada para integración con Laravel API.

## Estructura del proyecto

```text
src/app/
	core/
		config/            # tokens de configuración (API URL)
		interceptors/      # manejo centralizado de errores HTTP
		services/          # ApiService y StorageService
		utils/
	shared/
		models/            # interfaces tipadas
		validators/        # validaciones reutilizables
		ui/
	layout/
		shell/             # header/nav + router-outlet
	features/
		catalog/           # listado y detalle de productos
		promotions/        # promociones activas
		cart/              # carrito con localStorage
		checkout/          # formulario y envío WhatsApp/Web
		orders/            # estado del pedido web
	app.config.ts        # providers globales
	app.routes.ts        # rutas lazy por feature
```

## Separación de responsabilidades

- **Componentes (`pages`)**: UI y eventos de usuario.
- **Servicios (`services`)**: lógica de negocio, estado y llamadas API.
- **Interfaces (`shared/models`)**: contratos tipados del dominio.
- **Utilidades/validadores**: reglas reutilizables y consistentes.

## Flujo del cliente (end-to-end)

1. Navega al catálogo (`/catalog`) y revisa productos.
2. Entra al detalle (`/catalog/:id`) y agrega al carrito.
3. Gestiona cantidades o elimina en `/cart`.
4. Pasa a `/checkout`, completa datos y tipo de entrega.
5. Elige salida:
	 - **WhatsApp**: genera enlace con pedido formateado.
	 - **Web**: `POST /orders` al backend Laravel.
6. Si es pedido web, consulta estado en `/orders/:id/status`.

## Seguridad (OWASP + alineación ISO 27001/27002)

- **Validación de entrada** en formularios (`Validators`, reglas de longitud/formato).
- **Interceptor de errores** para no exponer trazas sensibles al usuario.
- **XSS**: no usar `innerHTML`; interpolación Angular por defecto.
- **Datos sensibles**: no guardar tokens/secretos en `localStorage`.
- **HTTPS**: obligatorio en producción (frontend + API).
- **Headers recomendados en Laravel**: `Content-Security-Policy`, `X-Content-Type-Options`, `Referrer-Policy`, `Strict-Transport-Security`.
- **Validación backend**: Laravel siempre revalida payloads (`FormRequest`/rules), incluso si frontend valida.

## Integración con Laravel API

- Base URL centralizada con token `API_BASE_URL` en `app.config.ts`.
- `ApiService` encapsula `HttpClient` (`get`, `post`).
- `OrdersService` usa endpoints esperados:
	- `POST /orders`
	- `GET /orders/{id}/status`

## Scripts

```bash
npm run start
npm run build
npm run test
```

## Siguiente etapa sugerida

- Conectar `CatalogService` a endpoints reales de Laravel.
- Añadir `auth interceptor` para JWT cuando habilites login.
- Implementar pruebas unitarias para `CartService` y `CheckoutService`.
