// Diccionario de campos + test base (12 preguntas del documento de diseño).
// Cada pregunta llena un campo del expediente.
export const TEST_BASE = [
  { campo: "edad", pregunta: "¿Cuántos años tienes?", tipo: "unica",
    opciones: ["18 a 24", "25 a 34", "35 a 44", "45 a 59", "60 o más"] },
  { campo: "municipio", pregunta: "¿En qué municipio vives?", tipo: "unica",
    opciones: ["Ahome", "Guasave", "El Fuerte", "Otro"],
    // Al elegir «Otro» se pide el nombre (opcional) y se guarda en municipio_otro
    otro: { opcion: "Otro", campo: "municipio_otro", label: "¿Cuál?" } },
  { campo: "escolaridad", pregunta: "¿Hasta qué grado estudiaste?", tipo: "unica",
    opciones: ["Sin estudios", "Primaria", "Secundaria", "Media superior", "Licenciatura"] },
  { campo: "situacion", pregunta: "¿Cuál es tu situación hoy?", tipo: "unica",
    opciones: ["Sin ingreso", "Empleo informal", "Empleo formal", "Negocio propio"] },
  { campo: "meta", pregunta: "¿Qué te gustaría lograr?", tipo: "unica",
    opciones: ["Un empleo", "Iniciar o hacer crecer un negocio", "Aprender algo nuevo", "No sé todavía"] },
  { campo: "horas_semana", pregunta: "¿Cuántas horas a la semana tienes libres?", tipo: "unica",
    opciones: ["Menos de 10", "10 a 15", "16 a 29", "30 o más"] },
  { campo: "horario", pregunta: "¿En qué horario puedes?", tipo: "multiple",
    opciones: ["Mañana", "Tarde", "Noche", "Fines de semana"] },
  { campo: "cuidados", pregunta: "¿Tienes personas a tu cargo?", tipo: "multiple",
    opciones: ["Niñas o niños", "Personas mayores", "Ninguna"], exclusiva: "Ninguna" },
  { campo: "dispositivo", pregunta: "¿Con qué te conectas?", tipo: "unica",
    opciones: ["Solo celular con datos", "Celular con wifi", "Computadora"] },
  { campo: "habilidades", pregunta: "¿Qué sabes hacer?", tipo: "multiple",
    opciones: ["Cocina", "Costura", "Ventas", "Cuidado de personas", "Limpieza", "Computación", "Atención al cliente", "Otra"],
    otro: { opcion: "Otra", campo: "habilidades_otra", label: "¿Qué otra cosa sabes hacer?" } },
  { campo: "negocio", pregunta: "¿Tienes un negocio o una idea?", tipo: "unica",
    opciones: ["No", "Tengo una idea", "Ya vendo"] },
  { campo: "documentos", pregunta: "¿Con qué documentos cuentas?", tipo: "multiple",
    opciones: ["CURP", "INE", "RFC", "Comprobante de domicilio"] },
];

// Preguntas "faltantes" que el agente hace al abrir un recurso (campo → texto claro)
/** ¿Eligió la opción «Otro/Otra» de esta pregunta? (única o de varias respuestas) */
export const eligioOtro = (q, valor) =>
  Boolean(q.otro) && (Array.isArray(valor) ? valor.includes(q.otro.opcion) : valor === q.otro.opcion);

/** Agrega el texto de «Otro/Otra» solo si eligió esa opción y escribió algo. */
export function conTextoOtro(q, valor, texto) {
  const t = (texto || "").trim();
  return eligioOtro(q, valor) && t ? { [q.otro.campo]: t } : {};
}

export const DICCIONARIO_PREGUNTAS = {
  tiene_rfc: { pregunta: "¿Tienes RFC?", opciones: ["Sí", "No"] },
  habilidad_excel: { pregunta: "¿Qué tanto sabes usar Excel?", opciones: ["Nada", "Básico", "Intermedio"] },
};
