// Cliente de la API (FastAPI). Mismas formas de datos que los mocks de services/ y data/.
import { supabase } from "../lib/supabase";

const BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";
const TIMEOUT_MS = 12000; // la IA tiene 6 s de límite en el backend; esto cubre red lenta

async function token() {
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token || null;
}

export class ApiError extends Error {
  constructor(status, detail) { super(detail); this.status = status; }
}

async function pedir(metodo, ruta, cuerpo) {
  const t = await token();
  const ctrl = new AbortController();
  const id = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const r = await fetch(`${BASE}${ruta}`, {
      method: metodo,
      headers: { "Content-Type": "application/json", ...(t ? { Authorization: `Bearer ${t}` } : {}) },
      body: cuerpo ? JSON.stringify(cuerpo) : undefined,
      signal: ctrl.signal,
    });
    const datos = r.status === 204 ? null : await r.json().catch(() => null);
    if (!r.ok) throw new ApiError(r.status, datos?.detail || "Algo salió mal");
    return datos;
  } catch (e) {
    if (e.name === "AbortError") throw new ApiError(0, "La conexión está lenta. Intenta de nuevo.");
    throw e;
  } finally {
    clearTimeout(id);
  }
}

const get = (r) => pedir("GET", r);
const post = (r, b) => pedir("POST", r, b);
const patch = (r, b) => pedir("PATCH", r, b);
const del = (r) => pedir("DELETE", r);

export const api = {
  // Público
  salud: () => get("/salud"),
  diccionario: () => get("/diccionario"),
  emergencia: () => get("/emergencia"),

  // Usuaria
  registro: (datos) => post("/me/registro", datos),                  // {acepto_privacidad, nombre?, telefono?}
  expediente: () => get("/me/expediente"),                            // {version, campos, conflictos}
  guardarCampos: (campos, fuente = "test_base") => patch("/me/expediente", { campos, fuente }),
  ruta: () => get("/me/ruta"),                                        // {principal, puente, puntajes, factores, explicacion}
  recomendaciones: () => get("/me/recomendaciones"),                  // {ruta, recursos: [...10]}
  recurso: (id) => get(`/me/recursos/${id}`),                         // recurso + preguntas + explicacion + cumple
  accion: (id, accion) => post(`/me/recursos/${id}/accion`, { accion }), // "aplicar" | "guardar"
  seguimiento: () => get("/me/seguimiento"),
  chat: (mensaje) => post("/chat", { mensaje }),                      // {respuesta, proponer_canalizacion, emergencia, senal}
  canalizar: (datos) => post("/me/canalizaciones", datos),            // {tipo, contacto, consentimiento: true}
  misCanalizaciones: () => get("/me/canalizaciones"),
  borrarSensible: () => del("/me/expediente-sensible"),

  // Panel
  admin: {
    yo: () => get("/admin/yo"),
    usuarias: () => get("/admin/usuarias"),
    usuaria: (id) => get(`/admin/usuarias/${id}`),
    situacion: (id, datos) => post(`/admin/usuarias/${id}/situacion`, datos),   // {estado, nota?, ruta?, motivo?}
    contacto: (id, datos) => post(`/admin/usuarias/${id}/contactos`, datos),     // {medio, resultado, nota?}
    recursos: () => get("/admin/recursos"),
    guardarRecurso: (oferta) => post("/admin/recursos", oferta),
    publicar: (id, publicada) => patch(`/admin/recursos/${id}/publicacion`, { publicada }),
    canalizaciones: () => get("/admin/canalizaciones"),
    caso: (folio) => get(`/admin/canalizaciones/${folio}`),
    actualizarCaso: (folio, datos) => patch(`/admin/canalizaciones/${folio}`, datos), // {estado?, nota?, asignar_a_mi?}
    metricas: () => get("/admin/metricas"),
  },
};
