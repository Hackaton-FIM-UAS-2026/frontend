import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button, Input } from "../../components/atoms";
import { crearCuentaCorreo } from "../../lib/supabase";
import { EntradaLayout } from "./Layout.jsx";
import { BotonGoogle } from "./Google.jsx";
import { adondeIr, volverSeguro } from "./sesion.js";

/** /registro — cuenta nueva: correo y contraseña primero (con casilla), Google abajo (acepta al continuar). */
export default function CrearCuenta() {
  const nav = useNavigate();
  const [params] = useSearchParams();
  const volver = volverSeguro(params.get("volver"));
  const [d, setD] = useState({ nombre: "", correo: "", pass: "" });
  const [acepta, setAcepta] = useState(false);
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  const crear = async (e) => {
    e.preventDefault();
    setError("");
    if (!d.nombre.trim()) return setError("Escribe tu nombre.");
    if (!d.correo.trim()) return setError("Escribe tu correo.");
    if (d.pass.length < 6) return setError("La contraseña debe tener al menos 6 caracteres.");
    if (!acepta) return setError("Para continuar, acepta el aviso de privacidad.");
    setEnviando(true);
    try {
      const sesion = await crearCuentaCorreo(d.correo.trim(), d.pass, d.nombre.trim());
      if (!sesion) { setEnviando(false); return setError("Te mandamos un correo para confirmar tu cuenta. Ábrelo y vuelve a entrar."); }
      nav(await adondeIr({ nueva: true, volver, nombre: d.nombre.trim() }), { replace: true });
    } catch (err) {
      setError(err.message);
      setEnviando(false);
    }
  };

  return (
    <EntradaLayout>
      <form className="m1-pila" onSubmit={crear} noValidate>
        <h1 className="m1-titulo">Crea tu cuenta</h1>
        <p className="m1-lead">Es gratis. En 3 minutos te mostramos tus opciones.</p>
        <Input id="nombre" label="¿Cómo te llamas?" autoComplete="given-name" value={d.nombre} onChange={(e) => setD({ ...d, nombre: e.target.value })} />
        <Input id="correo" type="email" label="Tu correo" autoComplete="email" value={d.correo} onChange={(e) => setD({ ...d, correo: e.target.value })} />
        <Input id="pass" type="password" label="Crea una contraseña" autoComplete="new-password" hint="Al menos 6 caracteres."
          value={d.pass} onChange={(e) => setD({ ...d, pass: e.target.value })} />
        <label className="check-row m1-check">
          <input type="checkbox" checked={acepta} onChange={(e) => setAcepta(e.target.checked)} />
          <span>Acepto el <Link to="/privacidad">aviso de privacidad</Link></span>
        </label>
        {error && <p className="m1-error" role="alert">{error}</p>}
        <Button block type="submit" loading={enviando}>Crear mi cuenta</Button>
      </form>
      <BotonGoogle texto="Registrarme con Google" nueva volver={volver} onError={setError} />
      <p className="m1-ayuda">Al continuar con Google aceptas el <Link to="/privacidad">aviso de privacidad</Link>.</p>
      <p className="m1-cambio">¿Ya tienes cuenta? <Link to={volver ? `/entrar?volver=${encodeURIComponent(volver)}` : "/entrar"}>Inicia sesión</Link></p>
    </EntradaLayout>
  );
}
