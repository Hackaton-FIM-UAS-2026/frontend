import { AppTemplate } from "../components/templates";
import { PageHeader } from "../components/molecules";
import { Button, ProgressBar } from "../components/atoms";
import { leerExpediente } from "../services/expediente";

export default function Seguimiento() {
  const exp = leerExpediente();
  const n = Object.keys(exp.campos).length;
  return (
    <AppTemplate>
      <PageHeader title="Mi avance" lead={`Tu perfil creció: versión ${exp.version}.`} />
      <section className="card avance" aria-labelledby="perfil-titulo">
        <h2 id="perfil-titulo" className="card__title">Perfil completo</h2>
        <p className="avance__cifra">
          <span className="stat__value">{n}</span>
          <span className="muted">de 20 datos guardados</span>
        </p>
        <ProgressBar value={n} max={20} label="Perfil completo" />
        <p className="muted small">Entre más completes, mejores recomendaciones.</p>
        <Button variant="quiet" to="/dashboard" className="avance__cta">Ver mis recursos</Button>
      </section>
    </AppTemplate>
  );
}
