# Ecommerce

Tienda web para compradores, vendedores y administración. El comprador navega el catálogo, añade productos al carrito y registra pedidos. La aplicación no documenta una pasarela de pago operativa; un pedido registrado no equivale a un cobro confirmado.

## Arquitectura y componentes

[`src/main.tsx`](src/main.tsx) monta la aplicación; [`src/App.tsx`](src/App.tsx) agrupa proveedores de estado y rutas con carga diferida. Las [páginas](src/pages/) definen catálogo, ficha, carrito, checkout, pedidos y pantallas de gestión; los [contextos](src/context/) comparten sesión, catálogo, carrito, favoritos y tema. [`src/lib/supabase.ts`](src/lib/supabase.ts) conecta directamente el navegador con Supabase: no hay servidor de aplicación separado en este árbol.

## Flujo de compra

El catálogo se carga mediante [`ProductContext.tsx`](src/context/ProductContext.tsx). El comprador elige un producto y [`CartContext.tsx`](src/context/CartContext.tsx) guarda el carrito en `localStorage`, independiente de la persistencia de pedidos. Con sesión iniciada, [`CheckoutPage.tsx`](src/pages/CheckoutPage.tsx) escribe en `orders` y luego en `order_items`; [`OrdersPage.tsx`](src/pages/OrdersPage.tsx) consulta el resultado. El código del cliente realiza escrituras separadas, por lo que no documenta una única transacción de checkout. El límite de permisos efectivo está en Supabase y sus políticas, no en qué páginas oculta React.

## Arranque y lectura

El [README](README.md) indica `npm install` y `npm run dev`. Configura `.env.local` a partir de [`.env.example`](.env.example), con la URL y clave pública de Supabase; no uses credenciales privilegiadas en el navegador. Revisa [`schema.sql`](schema.sql), [`schema_orders.sql`](schema_orders.sql) y [`schema_reviews.sql`](schema_reviews.sql) antes de preparar una base de prueba. No se confirmó un destino remoto ni qué SQL está aplicado allí.

Orden de lectura: `App.tsx` → `ProductContext.tsx` → `CartContext.tsx` → `CheckoutPage.tsx` → `schema_orders.sql`.
