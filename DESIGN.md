# Camino — sistema de diseño

**Fuente de verdad: `src/styles/tokens.css`.** Ningún otro archivo define colores, sombras ni duraciones. Los componentes consumen tokens semánticos, nunca primitivos.

## Mundo visual
Crema cálida como base, morado institucional para la marca y las acciones, y guinda como segunda acción. Sin franjas multicolor: el color de las rutas **solo codifica datos** (badges, gráfica, calendario). Profundidad con sombras suaves con desplazamiento, nunca con bordes de color a un lado.

## Color
| Rol | Token | Uso |
|---|---|---|
| Fondo | `--bg` (crema-50) | Página |
| Superficie | `--surface`, `--surface-sunken` | Tarjetas, secciones alternas |
| Marca | `--surface-brand` (morado-900) | Aside del test, resultado, KPI, pie, sidebar del panel |
| Acción | `--action` (morado-700) · `--action-soft` | Botón primario, estados activos |
| 2.ª acción | `--action-2` (guinda-700) | CTA de apoyo |
| Texto | `--text`, `--text-soft`, `--text-muted`, `--text-heading` | Todos ≥ 4.5:1 sobre crema y blanco |
| Estado | `--{success,warning,danger,info}` + `-soft` / `-ink` | Badges, toggles, urgencia |
| Rutas | `--ruta-{empleabilidad,emprendimiento,capacitacion}` + `-soft` / `-ink` | Solo datos |
| Sensible | `--sensible-*` | Solo morados |

## Tipografía
- **Fraunces** (500/600, con itálica) para h1–h2, logo y cifras grandes.
- **Noto Sans** (400–700) para todo lo demás, incluidos los títulos de los paneles de administración.
- Escala fluida `--step--2 … --step-5`. Base de 17px en móvil y 18px a partir de 960px; A−/A+ cambia `html { font-size }`.
- No hay *eyebrows* ni *kickers* sobre los títulos.

## Forma y espacio
- Radios: `--radius-sm 8 / md 12 / lg 20 / pill`. Tarjetas = `lg`, controles = `md`, botones = `pill`.
- Espacio en base 4 (`--space-1…9`) más `--space-10` fluido para el ritmo entre secciones.
- Layout: `.container` (1120px), `.container--narrow` (680px), `--gutter` fluido.
- Breakpoints mobile-first: 640 / 960 / 1280 (y 1100 para la navegación del portal y del panel).

## Componentes base
- **`.card`**: la única anatomía de tarjeta; variantes `--sunken`, `--brand`, `--flat` y `--link` (sube 2px al hacer hover).
- **`Button`**: variantes `primary | secondary | ghost | quiet | light | danger | link` y tamaños `md | sm`. Con `to`/`href` se renderiza como enlace (nunca un botón dentro de un enlace). Admite `loading`.
- **`Input`**: con `as="select" | "textarea"`, `hint` y `error`.
- **`.opt` / `OptionButton`**: opción táctil para el test, el flujo de apoyo y las preguntas del detalle.
- **`PageHeader`**: encabezado homologado de todas las páginas de la app.
- **Navegación**: `SiteHeader` (portal), `AppHeader` + `BottomNav` (app; pestañas en ≥960px), sidebar/drawer (panel). Las tres comparten la pastilla activa `--action-soft`.

## Movimiento
- Curvas: `--ease-out` (0.22, 1, 0.36, 1) para entradas, `--ease-drawer` para paneles, `--ease-in-out` para movimiento en pantalla.
- Duraciones: press 140ms · fast 180ms · base 240ms · slow 360ms. La UI se mantiene ≤ 300ms; solo los *drawers* llegan a 360ms.
- Botones `scale(.97)` al presionar; hover solo con `(hover: hover)`.
- `motion` (`motion/react`) para la transición direccional del test y del flujo de apoyo, las burbujas del chat, el menú móvil, el drawer del panel, la pastilla de navegación (`layoutId`) y la entrada única del hero.
- `MotionConfig reducedMotion="user"` + `global.css`: con movimiento reducido se quitan los desplazamientos y se conserva la opacidad.
- No hay animaciones al hacer scroll.
