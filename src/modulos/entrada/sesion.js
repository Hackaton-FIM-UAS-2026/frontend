import { supabase } from "../../lib/supabase";
import { api } from "../../services/api";
import { destino } from "../registro";

const CLAVE = "empoderate_acepto_privacidad";
export const recordarAceptacion = () => { try { sessionStorage.setItem(CLAVE, "1"); } catch {} };

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

/** Registra el consentimiento y decide a dónde va: test si no lo ha hecho, si no a su inicio. */
export async function adondeIr() {
  await api.registro({ acepto_privacidad: true });
  try { sessionStorage.removeItem(CLAVE); } catch {}
  const exp = await api.expediente().catch(() => null);
  return exp && Object.keys(exp.campos || {}).length ? destino("/inicio", "/dashboard") : "/test";
}
