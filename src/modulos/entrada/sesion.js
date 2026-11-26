import { supabase } from "../../lib/supabase";
import { api } from "../../services/api";
import { destino } from "../registro";

const CLAVE = "empoderate_despues";
/** Recuerda a dónde volver y si es cuenta nueva (Google sale de la app y regresa a /entrar/listo). */
export const recordar = (datos) => { try { sessionStorage.setItem(CLAVE, JSON.stringify(datos)); } catch {} };
export const recuperar = () => { try { return JSON.parse(sessionStorage.getItem(CLAVE)) || {}; } catch { return {}; } };

/** Solo rutas internas: nunca una URL externa en `volver`. */
export const volverSeguro = (v) => (typeof v === "string" && v.startsWith("/") && !v.startsWith("//") ? v : null);

/** Espera la sesión (Google vuelve con ella en la URL) hasta `ms`. */
export async function esperarSesion(ms = 6000) {
  const { data } = await supabase.auth.getSession();
  if (data.session) return data.session;
  return new Promise((ok) => {
    const t = setTimeout(() => { sub.subscription.unsubscribe(); ok(null); }, ms);
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      if (s) { clearTimeout(t); sub.subscription.unsubscribe(); ok(s); }
    });
  });
}

/**
 * Después de entrar: guarda el consentimiento y decide a dónde va.
 * Cuenta nueva → test. Cuenta que ya existe → a donde iba o a su inicio (nunca repite el test;
 * si no lo terminó, su inicio la invita a hacerlo).
 */
export async function adondeIr({ nueva = false, volver = null, nombre = null } = {}) {
  await api.registro({ acepto_privacidad: true, ...(nombre ? { nombre } : {}) });
  try { sessionStorage.removeItem(CLAVE); } catch {}
  if (nueva) return "/test";
  return volverSeguro(volver) || destino("/inicio", "/dashboard");
}
