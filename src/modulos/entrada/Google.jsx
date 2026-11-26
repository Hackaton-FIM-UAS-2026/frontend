import { useState } from "react";
import { Button } from "../../components/atoms";
import { entrarConGoogle } from "../../lib/supabase";
import { recordar } from "./sesion.js";

/** Botón secundario de Google, debajo del formulario de correo. */
export function BotonGoogle({ texto, nueva, volver, deshabilitado, onError }) {
  const [cargando, setCargando] = useState(false);
  const ir = async () => {
    setCargando(true);
    recordar({ nueva, volver });
    try { await entrarConGoogle(); } catch (e) { onError?.(e.message); setCargando(false); }
  };
  return (
    <>
      <div className="m1-o" aria-hidden="true"><span>o</span></div>
      <Button block className="m1-proveedor" onClick={ir} disabled={deshabilitado} loading={cargando}>
        <span className="m1-g" aria-hidden="true">G</span> {texto}
      </Button>
    </>
  );
}
