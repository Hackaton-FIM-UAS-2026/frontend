// Catálogo de EJEMPLO (mock). Sustituir por 40–60 recursos reales y verificados de Ahome/Sinaloa/federales.
export const RECURSOS = [
  { id: "r1", titulo: "Curso: finanzas básicas para tu negocio", proveedor: "Ejemplo — Secretaría de Economía",
    tipo: "curso", rutas: ["capacitacion", "emprendimiento"], modalidad: "En línea", horario: "Flexible",
    horas_semana: 4, costo: "Gratis", ubicacion: "En línea", fecha_cierre: "2026-12-20",
    requisitos: [
      { campo: "edad", ok: true, label: "Ser mayor de 18" },
      { campo: "tiene_rfc", ok: null, label: "Tener RFC", duro: false },
    ], url_accion: "#", verificado_el: "2026-11" },
  { id: "r2", titulo: "Apoyo para iniciar tu negocio desde casa", proveedor: "Ejemplo — Gobierno de Sinaloa",
    tipo: "apoyo", rutas: ["emprendimiento"], modalidad: "Presencial", horario: "Mañanas",
    horas_semana: 6, costo: "Gratis", ubicacion: "Los Mochis", fecha_cierre: "2027-01-15",
    requisitos: [
      { campo: "municipio", ok: true, label: "Vivir en Ahome" },
      { campo: "documentos", ok: true, label: "INE y CURP" },
      { campo: "tiene_rfc", ok: null, label: "Tener RFC", duro: false },
    ], url_accion: "#", verificado_el: "2026-11" },
  { id: "r3", titulo: "Vacante: atención al cliente (medio tiempo)", proveedor: "Ejemplo — Empresa local",
    tipo: "vacante", rutas: ["empleabilidad"], modalidad: "Presencial", horario: "Tardes",
    horas_semana: 25, costo: "Sueldo", ubicacion: "Los Mochis", fecha_cierre: "2026-12-10",
    requisitos: [
      { campo: "escolaridad", ok: true, label: "Media superior terminada" },
      { campo: "habilidad_excel", ok: null, label: "Excel básico", duro: false },
    ], url_accion: "#", verificado_el: "2026-11" },
  { id: "r4", titulo: "Beca: alfabetización digital desde el celular", proveedor: "Ejemplo — ONG",
    tipo: "beca", rutas: ["capacitacion"], modalidad: "En línea", horario: "Flexible",
    horas_semana: 3, costo: "Gratis", ubicacion: "En línea", fecha_cierre: "2027-02-01",
    requisitos: [{ campo: "dispositivo", ok: true, label: "Tener celular" }],
    url_accion: "#", verificado_el: "2026-11" },
];
