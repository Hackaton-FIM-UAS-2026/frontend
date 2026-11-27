// Datos 100 % FICTICIOS para la demo del panel (teléfonos 555 y correos .example).
export const USUARIAS = [
  { id: 1, nombre: "María Hernández",
    contacto: { telefono: "668 555 0101", correo: "maria.h@correo.example", medio: "WhatsApp", horario: "Mañanas" }, ruta: "emprendimiento", puente: "capacitacion", estado: "Inscrita", municipio: "Ahome", version: 4, ultima: "25 nov",
    campos: { Edad: "35 a 44", Escolaridad: "Secundaria", "Horas a la semana": "10 a 15", Horario: "Mañana", Cuidados: "Niñas o niños", Dispositivo: "Solo celular con datos", Negocio: "Ya vendo" },
    historial: [
      { fecha: "25 nov", texto: "Asesora registró: inscrita al curso de finanzas básicas", fuente: "personal_semujeres" },
      { fecha: "25 nov", texto: "Respondió: tiene RFC = No", fuente: "usuaria" },
      { fecha: "24 nov", texto: "Test base completado", fuente: "test_base" } ] },
  { id: 2, nombre: "Lucía Valenzuela",
    contacto: { telefono: "668 555 0102", correo: "lucia.v@correo.example", medio: "Correo", horario: "Tardes" }, ruta: "empleabilidad", puente: null, estado: "Nueva", municipio: "Ahome", version: 1, ultima: "25 nov",
    campos: { Edad: "18 a 24", Escolaridad: "Media superior", "Horas a la semana": "30 o más", Horario: "Mañana, Tarde", Cuidados: "Ninguna", Dispositivo: "Computadora", Negocio: "No" },
    historial: [{ fecha: "25 nov", texto: "Test base completado", fuente: "test_base" }] },
  { id: 3, nombre: "Rosa Beltrán",
    contacto: { telefono: "668 555 0103", correo: "rosa.b@correo.example", medio: "Llamada", horario: "Tardes" }, ruta: "capacitacion", puente: "emprendimiento", estado: "En curso", municipio: "Ahome", version: 3, ultima: "24 nov",
    campos: { Edad: "45 a 59", Escolaridad: "Primaria", "Horas a la semana": "10 a 15", Horario: "Tarde", Cuidados: "Personas mayores", Dispositivo: "Solo celular con datos", Negocio: "Tengo una idea" },
    historial: [
      { fecha: "24 nov", texto: "Se inscribió a alfabetización digital", fuente: "usuaria" },
      { fecha: "23 nov", texto: "Test base completado", fuente: "test_base" } ] },
  { id: 4, nombre: "Karla Osuna",
    contacto: { telefono: "668 555 0104", correo: "karla.o@correo.example", medio: "WhatsApp", horario: "Noches" }, ruta: "empleabilidad", puente: "capacitacion", estado: "Contratada", municipio: "Ahome", version: 5, ultima: "22 nov",
    campos: { Edad: "25 a 34", Escolaridad: "Media superior", "Horas a la semana": "16 a 29", Horario: "Tarde", Cuidados: "Niñas o niños", Dispositivo: "Celular con wifi", Negocio: "No" },
    historial: [{ fecha: "22 nov", texto: "Asesora registró: contratada (atención al cliente)", fuente: "personal_semujeres" }] },
  { id: 5, nombre: "Daniela Ruiz",
    contacto: { telefono: "687 555 0105", correo: "daniela.r@correo.example", medio: "Correo", horario: "Fines de semana" }, ruta: "emprendimiento", puente: null, estado: "Nueva", municipio: "Guasave", version: 1, ultima: "21 nov",
    campos: { Edad: "25 a 34", Escolaridad: "Licenciatura", "Horas a la semana": "16 a 29", Horario: "Fines de semana", Cuidados: "Ninguna", Dispositivo: "Computadora", Negocio: "Tengo una idea" },
    historial: [{ fecha: "21 nov", texto: "Test base completado", fuente: "test_base" }] },
  { id: 6, nombre: "Patricia Lugo",
    contacto: { telefono: "668 555 0106", correo: "patricia.l@correo.example", medio: "WhatsApp", horario: "Mañanas" }, ruta: "capacitacion", puente: null, estado: "Curso terminado", municipio: "Ahome", version: 4, ultima: "20 nov",
    campos: { Edad: "35 a 44", Escolaridad: "Secundaria", "Horas a la semana": "Menos de 10", Horario: "Mañana", Cuidados: "Niñas o niños", Dispositivo: "Solo celular con datos", Negocio: "No" },
    historial: [{ fecha: "20 nov", texto: "Asesora registró: curso terminado", fuente: "personal_semujeres" }] },
];

export const CASOS_INICIALES = [
  { id: "C-014", usuaria: "Usuaria anónima A", urgencia: "inmediata", tipo: "Psicológica", medio: "Mensaje de texto", horario: "Mañanas", estado: "nueva", fecha: "25 nov" },
  { id: "C-013", usuaria: "Usuaria anónima B", urgencia: "pronta", tipo: "Jurídica", medio: "Llamada", horario: "Tardes", estado: "contactada", fecha: "24 nov" },
  { id: "C-012", usuaria: "Usuaria anónima C", urgencia: "pronta", tipo: "Ambas", medio: "Solo dentro de la app", horario: "Noches", estado: "en atención", fecha: "22 nov" },
  { id: "C-011", usuaria: "Usuaria anónima D", urgencia: "informativa", tipo: "Jurídica", medio: "Llamada", horario: "Mañanas", estado: "cerrada", fecha: "19 nov" },
];

export const SEMANAS = ["S1", "S2", "S3", "S4", "S5"];
export const SERIES = [
  { nombre: "Empleabilidad", color: "var(--turquesa-500)", datos: [8, 12, 15, 11, 18] },
  { nombre: "Emprendimiento", color: "var(--naranja-500)", datos: [6, 9, 14, 17, 15] },
  { nombre: "Capacitación", color: "var(--magenta-500)", datos: [10, 13, 9, 14, 20] },
];

export const ACTIVIDAD = [
  { quien: "Ana Torres", rol: "Asesora económica", texto: "Registró «inscrita» en la ficha de María Hernández.", hora: "Hace 20 min", tono: "naranja" },
  { quien: "Sistema", rol: "Bitácora", texto: "Nuevo caso C-014 en la bandeja de canalizaciones.", hora: "Hace 1 h", tono: "turquesa" },
  { quien: "Ana Torres", rol: "Asesora económica", texto: "Actualizó la ruta de Karla Osuna con motivo.", hora: "Ayer", tono: "magenta" },
];

// Días del mes con eventos (seguimientos agendados)
export const MARCAS_CALENDARIO = { 3: "turquesa", 10: "naranja", 17: "magenta", 25: "hoy", 27: "mostaza" };
