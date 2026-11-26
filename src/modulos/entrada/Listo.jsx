import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/atoms";
import { EntradaLayout } from "./Layout.jsx";
import { adondeIr, esperarSesion } from "./sesion.js";

/** Regreso de Google: espera la sesión, registra el consentimiento y la lleva a su lugar. */
export default function Listo() {
  const nav = useNavigate();
  const [error, setError] = useState("");
  useEffect(() => {
    let vivo = true;
    (async () => {
      const s = await esperarSesion();
      if (!vivo) return;
      if (!s) return setError("No pudimos terminar de entrar. Intenta de nuevo.");
      try { nav(await adondeIr(), { replace: true }); }
      catch (e) { if (vivo) setError(e.status === 403 ? "Esta cuenta es del personal. Entra desde el panel." : e.message); }
    })();
    return () => { vivo = false; };
  }, [nav]);
  return (
    <EntradaLayout>
      {error
        ? <><p className="m1-error" role="alert">{error}</p><Button block to="/entrar">Volver a intentar</Button></>
        : <p className="m1-lead" role="status">Entrando…</p>}
    </EntradaLayout>
  );
}
