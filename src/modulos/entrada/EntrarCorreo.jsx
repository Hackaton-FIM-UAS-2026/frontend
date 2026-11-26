import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input } from "../../components/atoms";
import { entrarConCorreo, crearCuentaCorreo } from "../../lib/supabase";
import { EntradaLayout } from "./Layout.jsx";
import { adondeIr } from "./sesion.js";

export default function EntrarCorreo() {
  const nav = useNavigate();
  const [correo, setCorreo] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState("");

  const hacer = async (tipo) => {
    setError("");
    if (!correo.trim() || pass.length < 6) return setError("Escribe tu correo y una contraseña de al menos 6 caracteres.");
    setCargando(tipo);
    try {
      const sesion = tipo === "entrar" ? await entrarConCorreo(correo.trim(), pass) : await crearCuentaCorreo(correo.trim(), pass);
      if (!sesion) { setCargando(""); return setError("Te mandamos un correo para confirmar tu cuenta. Ábrelo y vuelve a entrar."); }
      nav(await adondeIr(), { replace: true });
    } catch (e) {
      setError(e.status === 403 ? "Esta cuenta es del personal. Entra desde el panel." : e.message);
      setCargando("");
    }
  };

  return (
    <EntradaLayout regresar={{ to: "/entrar", texto: "Regresar" }}>
      <form className="m1-pila" noValidate onSubmit={(e) => { e.preventDefault(); hacer("entrar"); }}>
        <h1 className="m1-titulo">Entrar con tu correo</h1>
        <Input id="correo" type="email" label="Tu correo" autoComplete="email" value={correo} onChange={(e) => setCorreo(e.target.value)} />
        <Input id="pass" type="password" label="Contraseña" autoComplete="current-password" minLength={6}
          value={pass} onChange={(e) => setPass(e.target.value)} />
        {error && <p className="m1-error" role="alert">{error}</p>}
        <Button block type="submit" loading={cargando === "entrar"}>Entrar</Button>
        <Button block variant="ghost" onClick={() => hacer("crear")} loading={cargando === "crear"}>Es mi primera vez: crear cuenta</Button>
      </form>
    </EntradaLayout>
  );
}
