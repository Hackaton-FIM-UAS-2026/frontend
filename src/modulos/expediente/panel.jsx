import ResumenArea from "./ResumenArea.jsx";
import Solicitudes from "./Solicitudes.jsx";
import Casos from "./Casos.jsx";
import Expedientes from "./Expedientes.jsx";

export const secciones = [
  { ruta: "resumen-area", titulo: "Resumen", icono: "panel", roles: ["trabajo_social", "especialista_juridica", "especialista_psicologica"], Componente: ResumenArea },
  { ruta: "solicitudes", titulo: "Solicitudes nuevas", icono: "bandeja", roles: ["trabajo_social"], Componente: Solicitudes },
  { ruta: "casos", titulo: "Mis casos", icono: "usuarias", roles: ["trabajo_social", "especialista_juridica", "especialista_psicologica"], Componente: Casos },
  { ruta: "expedientes", titulo: "Expedientes", icono: "libro",
    roles: ["trabajo_social", "especialista_juridica", "especialista_psicologica", "asesora_economica", "coordinacion"], Componente: Expedientes },
];
