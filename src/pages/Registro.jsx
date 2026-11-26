import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button, Input } from "../components/atoms";
import { AuthTemplate } from "../components/templates";
import { entrar } from "../lib/supabase";
import { api } from "../services/api";

export default function Registro() {
  const nav = useNavigate();
  const [acepta, setAcepta] = useState(false);
  const [correo, setCorreo] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  const comenzar = async (e) => {
    e.preventDefault();
    setError("");
    setEnviando(true);
    try {
      await entrar(correo.trim(), pass);
      await api.registro({ acepto_privacidad: true });
      // Si ya contestó el test, la mandamos directo a sus recursos
      const exp = await api.expediente().catch(() => null);
      nav(exp && Object.keys(exp.campos || {}).length ? "/dashboard" : "/test");
    } catch (err) {
      setError(err.status === 403
        ? "Esta cuenta es del personal. Entra desde /admin."
        : err.message || "No pudimos entrar. Revisa tus datos.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <AuthTemplate>
      <form onSubmit={comenzar}>
        <h1>Encuentra tu siguiente paso</h1>
        <p className="muted auth__lead">En 5 minutos te decimos qué curso, vacante, beca o apoyo es para ti.</p>
        <Input id="contacto" type="email" label="Tu correo" autoComplete="email" required
          value={correo} onChange={(e) => setCorreo(e.target.value)} />
        <Input id="password" type="password" label="Contraseña" autoComplete="current-password" required minLength={6}
          hint="Mínimo 6 caracteres. Si es tu primera vez, se crea tu cuenta."
          value={pass} onChange={(e) => setPass(e.target.value)} error={error || undefined} />
        <label className="check-row auth__check">
          <input type="checkbox" checked={acepta} onChange={(e) => setAcepta(e.target.checked)} />
          <span>Acepto el <a href="/#privacidad">aviso de privacidad</a> (LFPDPPP).</span>
        </label>
        <Button block type="submit" disabled={!acepta} loading={enviando}>Comenzar</Button>
      </form>
    </AuthTemplate>
  );
}
