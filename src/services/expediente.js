// Estado de ejemplo en memoria + localStorage. Sustituir por llamadas a FastAPI/Supabase.
const KEY = "camino_expediente";

export function leerExpediente() {
  try { return JSON.parse(localStorage.getItem(KEY)) || { version: 0, campos: {} }; }
  catch { return { version: 0, campos: {} }; }
}

// Regla de fusión: usuaria > personal > entrevista > test base > IA
export function guardarCampos(nuevos, fuente = "test_base") {
  const exp = leerExpediente();
  Object.entries(nuevos).forEach(([k, v]) => {
    exp.campos[k] = { valor: v, fuente, confianza: 1, fecha: new Date().toISOString() };
  });
  exp.version += 1;
  try { localStorage.setItem(KEY, JSON.stringify(exp)); } catch {}
  return exp;
}

export function valores(exp) {
  return Object.fromEntries(Object.entries(exp.campos).map(([k, c]) => [k, c.valor]));
}

// Plantillas de respaldo si el LLM tarda más de 6 s
export const explicacionRespaldo = (ruta) =>
  `Te sugerimos ${ruta} por lo que nos contaste de tu tiempo y lo que quieres lograr.`;
