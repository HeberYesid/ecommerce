# Guía para agentes

## Antes de cambiar

Lee `README.md`, `package.json`, `.env.example` y las migraciones `schema*.sql`. Revisa `git status --short` y preserva cambios ajenos.

## Arquitectura

- `src/App.tsx` define las rutas y carga páginas de forma diferida.
- `src/pages/` contiene pantallas por flujo.
- `src/context/` contiene estado global de auth, productos, carrito, favoritos y tema.
- `src/lib/supabase.ts` es el único cliente Supabase del frontend.
- `src/schemas/` contiene validaciones de entrada.

No pongas secretos en variables `VITE_*`; la clave anónima de Supabase es pública, las credenciales privadas no.

## Verificación

```powershell
npm install
npm run lint
npm run test
npm run build
```

Los cambios de datos deben incluir el SQL correspondiente y una explicación de compatibilidad. No ejecutes migraciones contra un proyecto remoto sin autorización explícita.
