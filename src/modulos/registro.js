// Registro automático de módulos (M0). Cada módulo vive en src/modulos/<nombre>/ y expone:
//   rutas.jsx → export const rutas = [{ path: "/inicio", element: <Inicio /> }]
//   panel.jsx → export const secciones = [{ ruta, titulo, icono, roles: [...], Componente }]
// App.jsx y AdminPanel.jsx los leen de aquí: ningún módulo edita archivos compartidos.
const archivosRutas = import.meta.glob("./*/rutas.jsx", { eager: true });
const archivosPanel = import.meta.glob("./*/panel.jsx", { eager: true });

export const rutasModulos = Object.values(archivosRutas).flatMap((m) => m.rutas || []);
export const seccionesPanel = Object.values(archivosPanel).flatMap((m) => m.secciones || []);

/** `path` si algún módulo ya lo registró; si no, `respaldo` (la pantalla anterior).
 *  Llamar solo al renderizar: hay imports circulares (módulo → plantillas → registro). */
export function destino(path, respaldo) {
  try {
    return rutasModulos.some((r) => r.path === path) ? path : respaldo;
  } catch {
    return respaldo; // todavía se están cargando los módulos
  }
}
