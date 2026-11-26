// Catálogo de recursos = catálogo base (data/recursos.js) + ofertas creadas o editadas
// por el personal en el panel. Demo en localStorage; sustituir por FastAPI/Supabase.
import { RECURSOS } from "../data/recursos";

const KEY = "empoderate_ofertas";

function leerCambios() {
  try { return JSON.parse(localStorage.getItem(KEY)) || {}; }
  catch { return {}; }
}

function escribirCambios(cambios) {
  try { localStorage.setItem(KEY, JSON.stringify(cambios)); } catch {}
}

/** Todo el catálogo (incluye ofertas en pausa). Para el panel. */
export function leerCatalogo() {
  const cambios = leerCambios();
  const base = RECURSOS.map((r) => ({ publicada: true, ...r, ...(cambios[r.id] || {}) }));
  const nuevas = Object.values(cambios).filter((o) => !RECURSOS.some((r) => r.id === o.id));
  return [...nuevas.sort((a, b) => (b.creada_el || "").localeCompare(a.creada_el || "")), ...base];
}

/** Solo lo que pueden ver las usuarias. */
export function leerCatalogoPublico() {
  return leerCatalogo().filter((r) => r.publicada !== false);
}

/** Crea (sin id) o actualiza (con id) una oferta. Devuelve la oferta guardada. */
export function guardarOferta(oferta) {
  const cambios = leerCambios();
  const hoy = new Date().toISOString().slice(0, 7);
  const id = oferta.id || `o-${Date.now().toString(36)}`;
  const guardada = {
    tipo: "vacante",
    rutas: ["empleabilidad"],
    publicada: true,
    creada_el: oferta.creada_el || new Date().toISOString(),
    ...oferta,
    id,
    verificado_el: hoy,
  };
  cambios[id] = guardada;
  escribirCambios(cambios);
  return guardada;
}

/** Publica o pausa una oferta sin tocar lo demás. */
export function cambiarPublicacion(id, publicada) {
  const actual = leerCatalogo().find((r) => r.id === id);
  if (!actual) return null;
  return guardarOferta({ ...actual, publicada });
}
