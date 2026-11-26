import { AppTemplate } from "../components/templates";
import { PageHeader, ApiEstado } from "../components/molecules";
import { Button, ProgressBar } from "../components/atoms";
import { api } from "../services/api";
import { useApi } from "../services/useApi";

const ESTADO = { aplicado: "Aplicaste", guardado: "Guardado" };

export default function Seguimiento() {
  const { datos: s, cargando, error, recargar } = useApi(api.seguimiento);
  if (!s) return <AppTemplate><ApiEstado cargando={cargando} error={error} reintentar={recargar} /></AppTemplate>;
  return (
    <AppTemplate>
      <PageHeader title="Mi avance" lead={`Tu perfil creció: versión ${s.version}.`} />
      <section className="card avance" aria-labelledby="perfil-titulo">
        <h2 id="perfil-titulo" className="card__title">Perfil completo</h2>
        <p className="avance__cifra">
          <span className="stat__value">{s.datos_guardados}</span>
          <span className="muted">de {s.total} datos guardados</span>
        </p>
        <ProgressBar value={s.datos_guardados} max={s.total} label="Perfil completo" />
        <p className="muted small">Entre más completes, mejores recomendaciones.</p>
        <Button variant="quiet" to="/dashboard" className="avance__cta">Ver mis recursos</Button>
      </section>

      {s.recursos.length > 0 && (
        <section className="card avance" aria-labelledby="mis-recursos">
          <h2 id="mis-recursos" className="card__title">Mis recursos</h2>
          <ul>
            {s.recursos.map((r) => (
              <li key={r.id}><strong>{r.titulo}</strong> <span className="muted small">· {ESTADO[r.estado] || r.estado} · {r.fecha}</span></li>
            ))}
          </ul>
        </section>
      )}

      {s.historial.length > 0 && (
        <section className="card avance" aria-labelledby="linea">
          <h2 id="linea" className="card__title">Tu historia</h2>
          <ul>
            {s.historial.map((h, i) => <li key={i}><span className="muted small">{h.fecha}</span> — {h.texto}</li>)}
          </ul>
        </section>
      )}
    </AppTemplate>
  );
}
