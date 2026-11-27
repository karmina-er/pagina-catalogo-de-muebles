# Multiforme — Mueblería de Autor

Catálogo web profesional de mobiliario residencial de alta gama con identidad visual en **rojo vino y oro**, tipografía editorial (`Cormorant Garamond`, `Plus Jakarta Sans`, `JetBrains Mono`) y arquitectura modular inspirada en el estándar clásico de páginas y recursos organizados.

## Estructura del Proyecto

- `index.html` — Punto de entrada y carga tipográfica
- `src/data/productos.json` — Catálogo inicial de piezas de autor
- `src/assets/images/` — Fotografía de estudio de cada pieza de mobiliario
- `src/context/StoreContext.tsx` — Estado global de catálogo, carrito, favoritos, tema oscuro y enrutamiento multipágina (`/`, `/catalogo`, `/producto/:id`, `/carrito`, `/contacto`, `/admin`, `/404`)
- `src/pages/InicioPage.tsx` — Portada editorial, colección destacada y maestría en materiales
- `src/pages/CatalogoPage.tsx` — Filtros dinámicos (categoría, material, precio, búsqueda, disponibilidad y ordenamiento)
- `src/pages/ProductoPage.tsx` — Ficha técnica, selector de acabado, planos de dimensiones y compra contigua
- `src/pages/CarritoPage.tsx` — Bolsa de compras con descuento de cortesía, control de existencias, lista de favoritos y confirmación de pedido
- `src/pages/ContactoPage.tsx` — Formulario de asesoría y citas en showroom con validación integral
- `src/pages/AdminPage.tsx` — Vista de administrador (accesible desde la parte inferior del sitio) para gestionar existencias y agregar nuevos productos
- `src/pages/NotFoundPage.tsx` — Página 404 editorial
