// Motor de ruta: lo decide el CÓDIGO (no la IA). Pesos visibles y ajustables.
export const PESOS = [
  { id: "meta_empleo", texto: "Quieres un empleo", cumple: (e) => e.meta === "Un empleo", suma: { empleabilidad: 3 } },
  { id: "meta_negocio", texto: "Quieres un negocio", cumple: (e) => e.meta?.includes("negocio"), suma: { emprendimiento: 3 } },
  { id: "meta_aprender", texto: "Quieres aprender", cumple: (e) => ["Aprender algo nuevo", "No sé todavía"].includes(e.meta), suma: { capacitacion: 3 } },
  { id: "ya_vende", texto: "Ya vendes o tienes una idea", cumple: (e) => ["Tengo una idea", "Ya vendo"].includes(e.negocio), suma: { emprendimiento: 2 } },
  { id: "tiempo_completo", texto: "Tienes 30 horas o más", cumple: (e) => e.horas_semana === "30 o más", suma: { empleabilidad: 2 } },
  { id: "poco_tiempo", texto: "Tienes poco tiempo o cuidas a alguien", cumple: (e) =>
      ["Menos de 10", "10 a 15"].includes(e.horas_semana) ||
      (e.cuidados || []).some((c) => c !== "Ninguna"),
    suma: { emprendimiento: 1, capacitacion: 1 } },
  { id: "prepa", texto: "Terminaste la prepa o más", cumple: (e) => ["Preparatoria", "Universidad"].includes(e.escolaridad), suma: { empleabilidad: 1 } },
  { id: "sin_digital", texto: "Aún no usas herramientas digitales", cumple: (e) =>
      e.meta === "Un empleo" && !(e.habilidades || []).includes("Computación"),
    suma: { capacitacion: 2 } },
];

export function calcularRuta(expediente) {
  const puntajes = { empleabilidad: 0, emprendimiento: 0, capacitacion: 0 };
  const factores = [];
  PESOS.forEach((p) => {
    if (p.cumple(expediente)) {
      Object.entries(p.suma).forEach(([ruta, pts]) => (puntajes[ruta] += pts));
      factores.push(p.texto);
    }
  });
  const orden = Object.entries(puntajes).sort((a, b) => b[1] - a[1]);
  const [principal, ptsP] = orden[0];
  const [segunda, ptsS] = orden[1];
  return {
    principal,
    puente: ptsP - ptsS <= 2 && ptsS > 0 ? segunda : null,
    puntajes,
    factores,
  };
}

export const NOMBRE_RUTA = {
  empleabilidad: "Empleabilidad",
  emprendimiento: "Emprendimiento",
  capacitacion: "Capacitación",
};
