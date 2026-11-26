// Solo para AUTH. Los datos se piden a FastAPI (services/api.js), nunca directo a las tablas.
// npm i @supabase/supabase-js
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
  { auth: { persistSession: true, autoRefreshToken: true } }
);

/** Registro o inicio de sesión con correo + contraseña (demo: "Confirm email" apagado). */
export async function entrar(correo, password) {
  let { data, error } = await supabase.auth.signInWithPassword({ email: correo, password });
  if (error && /invalid/i.test(error.message)) {
    ({ data, error } = await supabase.auth.signUp({ email: correo, password }));
  }
  if (error) throw error;
  return data.session;
}

export const salir = () => supabase.auth.signOut();
