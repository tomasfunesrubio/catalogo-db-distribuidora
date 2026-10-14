# Catálogo DB Distribuidora

Catálogo online de DB Distribuidora de Bebidas. Los clientes arman el pedido y lo envían por WhatsApp.

## Comandos

```bash
pnpm install          # instalar dependencias
pnpm dev              # servidor de desarrollo (http://localhost:3000)
pnpm build            # build de producción
pnpm import-catalog   # regenera data/ desde "CATALOGO 10 OCTUBRE.xlsx"
pnpm deploy:pages     # publica la demo en GitHub Pages
```

## Demo publicada

https://tomasfunesrubio.github.io/catalogo-db-distribuidora/

`pnpm deploy:pages` compila una versión estática (`GITHUB_PAGES=true`, servida bajo `/catalogo-db-distribuidora`) y la sube a la rama `gh-pages`. El Excel no se sube al repositorio.

## Páginas

- `/` — Inicio: ofertas, categorías y envíos
- `/categoria/[slug]` — Productos de una categoría (ej. `/categoria/cervezas`), generadas al hacer el build
- `/productos` — Todos los productos; el buscador del header lleva a `/productos?q=...`

La búsqueda es por nombre, marca y descripción (departamento), no por código.

## Estructura

```
app/
  layout.tsx                Banner, header, footer y carrito (compartidos por todas las páginas)
  page.tsx                  Inicio
  productos/page.tsx        Todos los productos
  categoria/[slug]/page.tsx Página de cada categoría
  globals.css
components/
  Header.tsx            Logo, buscador con sugerencias, WhatsApp, redes y botón del carrito
  OffersCarousel.tsx    Carrusel de ofertas y promociones
  CategoryGrid.tsx      Tarjetas de categorías del inicio
  Catalog.tsx           Listado de productos: accesos a categorías, búsqueda, orden y "cargar más"
  ProductCard.tsx       Tarjeta de producto
  ShippingInfo.tsx      Envíos, retiro y mapa
  Footer.tsx
  FloatingCartBar.tsx   Resumen fijo abajo cuando hay productos en el carrito
  CartDrawer.tsx        Carrito lateral: cantidades, método de entrega, datos y envío por WhatsApp
  Logo.tsx, SocialLinks.tsx
lib/
  categories.ts         Descripción, ícono y URL de cada categoría
  site-config.ts        Teléfono de WhatsApp, redes, dirección, zonas, envío gratis, descuento
  cart-context.tsx      Estado del carrito (guardado en localStorage)
  whatsapp-order.ts     Arma el mensaje del pedido
  utils.ts
data/
  catalog.json          Productos (generado)
  products.ts           Tipos, categorías y formato de precios (generado)
scripts/
  parse-catalog.py      Convierte el Excel en data/catalog.json y data/products.ts
```

## Actualizar precios / productos

1. Reemplazar `CATALOGO 10 OCTUBRE.xlsx` (mismo nombre y mismas columnas: código, descripción, costo, venta, mayoreo, departamento).
2. Ejecutar `pnpm import-catalog`.

No editar `data/catalog.json` ni `data/products.ts` a mano: el script los sobrescribe.

## Configuración

El número de WhatsApp se puede cambiar con la variable de entorno `NEXT_PUBLIC_WHATSAPP_NUMBER`; el resto de los datos del negocio está en `lib/site-config.ts`.
