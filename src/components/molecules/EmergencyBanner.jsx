import { Icon } from "../atoms";

/** Aviso de emergencia: 911 + área jurídica. Sobrio (sin rojo) y sin interrumpir lectores de pantalla. */
export function EmergencyBanner({ telefonoJuridico = "[pendiente: tomar del sitio oficial]" }) {
  return (
    <aside className="emergency" role="note" aria-label="Emergencias">
      <span className="emergency__icon"><Icon name="escudo" size={20} /></span>
      <div className="emergency__body">
        <strong>Si estás en peligro ahora, llama al 911.</strong>
        <span className="emergency__extra">Área jurídica, Secretaría de las Mujeres de Sinaloa: {telefonoJuridico}</span>
        <a className="emergency__tel" href="tel:911"><Icon name="telefono" size={18} /> Llamar al 911</a>
      </div>
    </aside>
  );
}
