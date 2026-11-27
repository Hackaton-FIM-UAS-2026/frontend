import { get, patch, post } from "../../services/api";

export const visitas = (cuando) => get(`/panel/visitas?cuando=${cuando}`);
export const marcar = (id, estado) => patch(`/panel/visitas/${id}`, { estado });
export const llegada = (datos) => post("/panel/visitas/llegada", datos);
