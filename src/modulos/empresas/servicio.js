import { get, patch, post } from "../../services/api";

export const registrar = (d) => post("/empresas/registro", d);
export const yo = () => get("/empresas/yo");
export const vacantes = () => get("/empresas/vacantes");
export const crearVacante = (d) => post("/empresas/vacantes", d);
export const candidatas = (id) => get(`/empresas/vacantes/${id}/candidatas`);
export const contratar = (id, usuariaId) => patch(`/empresas/vacantes/${id}/candidatas/${usuariaId}`, { estado: "contratada" });
export const pendientes = () => get("/panel/revision");
export const decidirEmpresa = (id, decision, motivo) => post(`/panel/revision/empresas/${id}`, { decision, motivo });
export const decidirVacante = (id, decision, motivo) => post(`/panel/revision/vacantes/${id}`, { decision, motivo });
