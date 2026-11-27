/** «viernes 28 nov · 10:00» a partir de un timestamp ISO (hora de Sinaloa). */
export function fechaCita(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  const dia = new Intl.DateTimeFormat("es-MX", { weekday: "long", day: "numeric", month: "short", timeZone: "America/Mazatlan" }).format(d);
  const hora = new Intl.DateTimeFormat("es-MX", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "America/Mazatlan" }).format(d);
  return `${dia.charAt(0).toUpperCase()}${dia.slice(1)} · ${hora}`;
}
export const MODALIDAD = { presencial: "En SEMujeres", llamada: "Por llamada", videollamada: "Por videollamada" };
