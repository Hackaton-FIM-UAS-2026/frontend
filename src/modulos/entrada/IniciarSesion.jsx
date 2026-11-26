import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button, Input } from "../../components/atoms";
import { entrarConCorreo } from "../../lib/supabase";
import { EntradaLayout } from "./Layout.jsx";
import { BotonGoogle } from "./Google.jsx";
import { adondeIr, volverSeguro } from "./sesion.js";

/** /entrar — para quien ya tiene cuenta. */
export default function IniciarSesion() {
  const nav = useNavigate();
  const [params] = useSearchParams();
  const volver = volverSeguro(params.get("volver"));
  const [correo, setCorreo] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  const entrar = async (e) => {
    e.preventDefault();
    setError("");
    if (!correo.trim() || !pass) return setError("Escribe tu correo y tu contraseña.");
    setEnviando(true);
    try {
      await entrarConCorreo(correo.trim(), pass);
      nav(await adondeIr({ volver }), { replace: true });
    } catch (err) {
      setError(err.status === 403 ? "Esta cuenta es del personal. Entra desde el panel de SEMujeres." : err.message);
      setEnviando(false);
    }
  };

  return (
    <EntradaLayout>
      <form className="m1-pila" onSubmit={entrar} noValidate>
        <h1 className="m1-titulo">Inicia sesión</h1>
        <p className="m1-lead">Qué gusto verte de nuevo.</p>
        <Input id="correo" type="email" label="Tu correo" autoComplete="email" value={correo} onChange={(e) => setCorreo(e.target.value)} />
        <Input id="pass" type="password" label="Contraseña" autoComplete="current-password" value={pass} onChange={(e) => setPass(e.target.value)} />
        {error && <p className="m1-error" role="alert">{error}</p>}
        <Button block type="submit" loading={enviando}>Entrar</Button>
      </form>
      <BotonGoogle texto="Entrar con Google" volver={volver} onError={setError} />
      <p className="m1-ayuda">Al entrar aceptas el <a href="/#privacidad">aviso de privacidad</a>.</p>
      <p className="m1-cambio">¿Es tu primera vez? <Link to={volver ? `/registro?volver=${encodeURIComponent(volver)}` : "/registro"}>Crea tu cuenta</Link></p>
    </EntradaLayout>
  );
}
