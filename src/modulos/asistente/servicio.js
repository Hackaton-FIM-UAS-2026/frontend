import { post, api } from "../../services/api";

export const enviarMensaje = (mensaje, historial) => post("/asistente/mensaje", { mensaje, historial });
export const canalizar = (datos) => post("/asistente/canalizar", datos);
export const agendarVisita = (datos) => post("/asistente/visita", datos);
export const emergencia = () => api.emergencia();

// Respaldo si la API no responde: palabras de peligro → mostrar la línea de SEMujeres
const PELIGRO = /matar|peligro|golpe|pega|amenaz|arma|cuchillo|no me deja salir|quitarme la vida/i;
export const hayPeligro = (t) => PELIGRO.test(t || "");
export const LINEA = { nombre: "Línea de atención · SEMujeres Ahome", telefono: "668 102 5080", tel: "+526681025080", respaldo: "911" };
