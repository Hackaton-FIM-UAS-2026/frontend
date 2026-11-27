// Solo para AUTH. Los datos se piden a FastAPI (services/api.js), nunca directo a las tablas.
// npm i @supabase/supabase-js
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
  { auth: { persistSession: true, autoRefreshToken: true } }
);

const errorAmable = (error, texto) => Object.assign(new Error(texto), { causa: error });

/** Entrar con Google: redirige a Google y vuelve a /entrar/listo. */
export async function entrarConGoogle() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: `${window.location.origin}/entrar/listo` },
  });
  if (error) throw errorAmable(error, "Por ahora no se puede entrar con Google. Intenta con tu correo.");
}

/** Entrar con correo y contraseña. Nunca crea una cuenta si falla. */
export async function entrarConCorreo(correo, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email: correo, password });
  if (error) throw errorAmable(error, "Ese correo o contraseña no coinciden.");
  return data.session;
}

/** Crear cuenta con correo (acción explícita de la usuaria). */
export async function crearCuentaCorreo(correo, password, nombre) {
  // El nombre va en los metadatos: si tiene que confirmar el correo, no se pierde
  const { data, error } = await supabase.auth.signUp({ email: correo, password, options: { data: { nombre } } });
  if (error) throw errorAmable(error, /registered|exists/i.test(error.message)
    ? "Ya hay una cuenta con ese correo. Usa «Entrar»."
    : "No pudimos crear tu cuenta. Revisa tus datos.");
  return data.session;
}

/** Conversación del asistente guardada solo en esta pestaña (se borra al salir o con «Salida rápida»). */
export const CLAVE_CHAT = "empoderate_chat";
export const borrarChat = () => { try { sessionStorage.removeItem(CLAVE_CHAT); } catch {} };

export const salir = () => { borrarChat(); return supabase.auth.signOut(); };
