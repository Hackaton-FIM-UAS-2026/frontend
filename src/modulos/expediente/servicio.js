import { get, patch, post } from "../../services/api";

export const solicitudes = () => get("/panel/solicitudes");
export const casos = () => get("/panel/casos");
export const buscar = (q) => get(`/panel/expedientes?q=${encodeURIComponent(q || "")}`);
export const expediente = (id) => get(`/panel/expedientes/${id}`);
export const asignar = (folio, area) => post(`/panel/solicitudes/${folio}/asignar`, { area });
export const nota = (id, texto) => post(`/panel/expedientes/${id}/notas`, { texto });
export const alta = (datos) => post("/panel/expedientes", datos);
export const derivar = (id, datos) => post(`/panel/expedientes/${id}/derivar`, datos);
export const estadoCaso = (folio, estado) => patch(`/admin/canalizaciones/${folio}`, { estado });
export const cita = (folio, datos) => patch(`/panel/casos/${folio}/cita`, datos);
