import { get } from "../../services/api";

export const caminos = () => get("/me/caminos");
export const catalogo = (f = {}) => {
  const q = new URLSearchParams(Object.entries(f).filter(([, v]) => v !== undefined && v !== "" && v !== false));
  return get(`/catalogo${q.toString() ? `?${q}` : ""}`);
};
