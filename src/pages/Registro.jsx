import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button, Input, Logo, Franja } from "../components/atoms";
import { AuthTemplate } from "../components/templates";

export default function Registro() {
  const nav = useNavigate();
  const [acepta, setAcepta] = useState(false);
  return (
    <AuthTemplate>
      <Logo />
      <Franja />
      <h1 style={{ marginTop: 16 }}>Encuentra tu siguiente paso</h1>
      <p>En 5 minutos te decimos qué curso, vacante, beca o apoyo es para ti.</p>
      <Input id="contacto" label="Tu correo o teléfono" />
      <label className="check-row" style={{ marginBottom: 16 }}>
        <input type="checkbox" checked={acepta} onChange={(e) => setAcepta(e.target.checked)} />
        Acepto el aviso de privacidad (LFPDPPP).
      </label>
      <Button block disabled={!acepta} onClick={() => nav("/test")}>Comenzar</Button>
    </AuthTemplate>
  );
}
