import { useState } from "react";
import { Button } from "../atoms";
import { EmergencyBanner } from "../molecules";

/** Canalización sensible: consentimiento expreso, contacto seguro, salida rápida. Nada se guarda sin confirmar. */
export function SensitiveFlow({ onDone }) {
  const [paso, setPaso] = useState(0);
  const [tipo, setTipo] = useState("");
  const [contacto, setContacto] = useState({ medio: "", horario: "", mensaje: "" });
  const [acepta, setAcepta] = useState(false);

  const salidaRapida = () => window.location.replace("https://www.google.com/search?q=clima");

  return (
    <div className="sensible">
      <button className="salida" onClick={salidaRapida}>Salir rápido</button>
      <EmergencyBanner />

      {paso === 0 && (
        <>
          <h2>¿Qué tipo de apoyo necesitas?</h2>
          {["Orientación jurídica", "Apoyo psicológico", "Ambas"].map((t) => (
            <button key={t} className={`qopt ${tipo === t ? "qopt--on" : ""}`} onClick={() => setTipo(t)}>{t}</button>
          ))}
          <Button block disabled={!tipo} onClick={() => setPaso(1)}>Continuar</Button>
        </>
      )}

      {paso === 1 && (
        <>
          <h2>¿Cómo es seguro contactarte?</h2>
          <label className="field"><span className="field__label">Medio</span>
            <select className="input" value={contacto.medio} onChange={(e) => setContacto({ ...contacto, medio: e.target.value })}>
              <option value="">Elige uno</option><option>Llamada</option><option>Mensaje de texto</option><option>Solo dentro de la app</option>
            </select></label>
          <label className="field"><span className="field__label">Mejor horario</span>
            <input className="input" value={contacto.horario} onChange={(e) => setContacto({ ...contacto, horario: e.target.value })} /></label>
          <label className="check-row"><input type="checkbox" checked={contacto.mensaje === "si"}
            onChange={(e) => setContacto({ ...contacto, mensaje: e.target.checked ? "si" : "" })} /> Se puede dejar mensaje</label>
          <Button block disabled={!contacto.medio} onClick={() => setPaso(2)}>Continuar</Button>
        </>
      )}

      {paso === 2 && (
        <>
          <h2>Tu consentimiento</h2>
          <p>Vamos a guardar solo: tipo de apoyo, tu forma segura de contacto y un resumen que tú apruebas.
             No guardamos tu conversación. Puedes borrar todo desde la app cuando quieras.</p>
          <label className="check-row"><input type="checkbox" checked={acepta} onChange={(e) => setAcepta(e.target.checked)} />
            Acepto el aviso de privacidad para datos sensibles y que me contacte una especialista de CEMujeres.</label>
          <Button block disabled={!acepta} onClick={() => onDone({ tipo, contacto })}>Enviar mi solicitud</Button>
          <Button block variant="ghost" onClick={() => onDone(null)}>No, gracias</Button>
        </>
      )}
    </div>
  );
}
