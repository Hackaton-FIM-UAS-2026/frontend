import { AppTemplate } from "../components/templates";
import { ProgressBar } from "../components/atoms";
import { leerExpediente } from "../services/expediente";

export default function Seguimiento() {
  const exp = leerExpediente();
  const n = Object.keys(exp.campos).length;
  return (
    <AppTemplate>
      <h1>Mi avance</h1>
      <p>Tu perfil creció: versión {exp.version}.</p>
      <ProgressBar value={n} max={20} label="Perfil completo" />
      <p className="muted small">{n} datos guardados. Entre más completes, mejores recomendaciones.</p>
    </AppTemplate>
  );
}
