import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

/**
 * Pantallas de la usuaria: si no hay sesión, la manda a /entrar y después la regresa aquí.
 * Regresa true cuando ya se confirmó que hay sesión.
 */
export function useRequiereSesion(activa = true) {
  const nav = useNavigate();
  const { pathname, search } = useLocation();
  const [lista, setLista] = useState(!activa);
  useEffect(() => {
    if (!activa) return;
    let vivo = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!vivo) return;
      if (data.session) setLista(true);
      else nav(`/entrar?volver=${encodeURIComponent(pathname + search)}`, { replace: true });
    });
    return () => { vivo = false; };
  }, [activa, nav, pathname, search]);
  return lista;
}
