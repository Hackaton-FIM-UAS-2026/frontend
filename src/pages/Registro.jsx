import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button, Input } from "../components/atoms";
import { AuthTemplate } from "../components/templates";

export default function Registro() {
  const nav = useNavigate();
  const [acepta, setAcepta] = useState(false);
  return (
    <AuthTemplate>
      <h1>Encuentra tu siguiente paso</h1>
      <p className="muted auth__lead">En 5 minutos te decimos qué curso, vacante, beca o apoyo es para ti.</p>
      <Input id="contacto" label="Tu correo o teléfono" autoComplete="email" />
      <label className="check-row auth__check">
        <input type="checkbox" checked={acepta} onChange={(e) => setAcepta(e.target.checked)} />
        <span>Acepto el <a href="/#privacidad">aviso de privacidad</a> (LFPDPPP).</span>
      </label>
      <Button block disabled={!acepta} onClick={() => nav("/test")}>Comenzar</Button>
    </AuthTemplate>
  );
}
