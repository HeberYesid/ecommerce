 # Ecommerce

Aplicación SPA de comercio electrónico construida con React, Vite, TypeScript y Supabase.

## Estado actual

- Catálogo, detalle de producto, carrito y lista de deseos.
- Autenticación, perfil, pedidos y checkout.
- Pantallas de vendedor y administración.
- Persistencia y autenticación mediante Supabase.
- Estado local de desarrollo; este README no certifica un despliegue.

## Requisitos e inicio

- Node.js `^20.19.0` o `>=22.12.0`, y npm.
- Un proyecto Supabase al que tengas acceso, con Auth y el esquema de la aplicación.

```powershell
npm install
Copy-Item .env.example .env.local
```

Configura `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` en `.env.local`. No pongas claves privadas en variables `VITE_*`.

Si usas una base Supabase vacía, aplica primero `schema.sql` y después `schema_update_final.sql`, `schema_orders.sql` y `schema_reviews.sql`. `schema_update_category.sql` es una alternativa anterior para la columna `category`; no lo ejecutes además de `schema_update_final.sql` en una base nueva. Si la base ya existe, comprueba qué cambios tiene antes de aplicar SQL.

```powershell
npm run dev
```

## Comandos

| Comando | Uso |
|---|---|
| `npm run dev` | Desarrollo con Vite |
| `npm run build` | Typecheck y build de producción |
| `npm run lint` | ESLint |
| `npm run test` | Vitest en modo interactivo |
| `npm run preview` | Previsualización del build |

## Estructura y decisiones

- `src/pages/`: catálogo, carrito, checkout, pedidos, perfil, vendedor y administración.
- `src/context/`: autenticación, productos, carrito, favoritos y tema.
- `src/lib/supabase.ts`: cliente Supabase del navegador.
- `schema*.sql`: esquemas y actualizaciones SQL del proyecto.

Las páginas se cargan de forma diferida y las rutas se centralizan en `src/App.tsx`. Supabase es el límite de persistencia; los cambios de datos deben documentarse junto con su migración SQL.
