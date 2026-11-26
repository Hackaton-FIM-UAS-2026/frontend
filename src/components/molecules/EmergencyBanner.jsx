/** Aviso de emergencia: 911 + área jurídica. Teléfono oficial pendiente (ver pendientes del diseño). */
export function EmergencyBanner({ telefonoJuridico = "[pendiente: tomar del sitio oficial]" }) {
  return (
    <div className="emergency" role="alert">
      <strong>Si estás en peligro ahora, llama al 911.</strong>
      <span>Área jurídica, Secretaría de las Mujeres de Sinaloa: {telefonoJuridico}</span>
    </div>
  );
}
