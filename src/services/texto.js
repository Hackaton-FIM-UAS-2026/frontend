/** Primera letra en mayúscula (estados, áreas y etiquetas que vienen en minúsculas del backend). */
export const cap = (t) => (typeof t === "string" && t ? t.charAt(0).toUpperCase() + t.slice(1) : t);

/** Para frases que siguen a dos puntos: primera letra en minúscula, sin tocar siglas (RFC, CURP, INE). */
export const enFrase = (t) => (typeof t === "string" && t && !/^[A-ZÁÉÍÓÚÑ]{2,}\b/.test(t) ? t.charAt(0).toLowerCase() + t.slice(1) : t);

/** Horario visible según el tipo: los apoyos y becas no llevan horario; los cursos y talleres siempre. */
const SIN_HORARIO = new Set(["apoyo", "beca", "financiamiento"]);
export function horarioDe(r) {
  if (SIN_HORARIO.has(r.tipo)) return null;
  if (r.tipo === "curso") return r.horario ? `Horario: ${r.horario}` : "Horario por confirmar";
  return r.horario || null;
}
