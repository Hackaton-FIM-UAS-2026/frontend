import { useState } from "react";
import { Button, Icon } from "../../components/atoms";
import { entrarConGoogle } from "../../lib/supabase";
import { EntradaLayout } from "./Layout.jsx";
import { recordarAceptacion } from "./sesion.js";

export default function Entrar() {
  const [acepta, setAcepta] = useState(false);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const google = async () => {
    setError(""); setCargando(true); recordarAceptacion();
    try { await entrarConGoogle(); } catch (e) { setError(e.message); setCargando(false); }
  };

  return (
    <EntradaLayout>
      <h1 className="m1-titulo">Hola. Entra para ver tus opciones</h1>
      <p className="m1-lead">Es gratis y tus datos están protegidos.</p>
      <Button block className="m1-proveedor" onClick={google} disabled={!acepta} loading={cargando}>
        <span className="m1-g" aria-hidden="true">G</span> Entrar con Google
      </Button>
      <Button block className="m1-proveedor" to={acepta ? "/entrar/correo" : undefined}
        aria-disabled={!acepta || undefined} onClick={acepta ? recordarAceptacion : (e) => e.preventDefault()}>
        <Icon name="correo" size={20} /> Entrar con mi correo
      </Button>
      <label className="check-row m1-check">
        <input type="checkbox" checked={acepta} onChange={(e) => setAcepta(e.target.checked)} />
        <span>Acepto el <a href="/#privacidad">aviso de privacidad</a></span>
      </label>
      {error && <p className="m1-error" role="alert">{error}</p>}
      <p className="m1-ayuda">¿Necesitas ayuda para entrar? Ven a SEMujeres Ahome o llama al <a href="tel:+526681025080">668 102 5080</a>.</p>
    </EntradaLayout>
  );
}
