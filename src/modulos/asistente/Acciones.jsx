import { useState } from "react";
import { Button, Icon } from "../../components/atoms";

/** Chips de respuesta rápida. */
export function Chips({ opciones, onElegir, disabled }) {
  return (
    <div className="m2-chips">
      {opciones.map((o) => (
        <button key={o} type="button" className="m2-chip" disabled={disabled} onClick={() => onElegir(o)}>{o}</button>
      ))}
    </div>
  );
}

/** Tarjeta de emergencia: el número viene de la configuración, nunca del texto de la IA. */
export function TarjetaEmergencia({ datos }) {
  return (
    <div className="card card--brand m2-emergencia" role="alert">
      <p className="m2-emergencia__titulo">Tu seguridad es primero</p>
      <p className="m2-emergencia__texto">Llama ahora a la línea de SEMujeres.</p>
      <Button block variant="light" href={`tel:${datos.tel || datos.telefono}`}>
        <Icon name="telefono" size={20} /> Llamar a SEMujeres · {datos.telefono}
      </Button>
      <p className="m2-emergencia__respaldo">Si no contestan: <a href="tel:911">911</a></p>
    </div>
  );
}

/** Resumen que ella aprueba (y puede corregir) antes de enviarlo. */
export function ConfirmarResumen({ resumen, onEnviar, enviando }) {
  const [editando, setEditando] = useState(false);
  const [texto, setTexto] = useState(resumen);
  return (
    <div className="m2-resumen">
      <p className="m2-resumen__titulo">Esto le vamos a enviar a SEMujeres:</p>
      {editando
        ? <textarea className="input" rows={3} value={texto} maxLength={600} onChange={(e) => setTexto(e.target.value)}
            aria-label="Corrige el resumen" />
        : <p className="m2-resumen__texto">«{texto}»</p>}
      <div className="m2-fila">
        <Button size="sm" loading={enviando} disabled={!texto.trim()} onClick={() => onEnviar(texto.trim())}>Está bien, enviar</Button>
        {!editando && <Button size="sm" variant="link" onClick={() => setEditando(true)}>Corregir</Button>}
      </div>
    </div>
  );
}
