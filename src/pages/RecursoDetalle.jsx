import { useParams, useNavigate } from "react-router-dom";
import { AppTemplate } from "../components/templates";
import { ResourceDetail } from "../components/organisms";
import { Button, Icon } from "../components/atoms";
import { leerCatalogoPublico } from "../services/catalogo";

export default function RecursoDetalle() {
  const { id } = useParams();
  const nav = useNavigate();
  const recurso = leerCatalogoPublico().find((r) => r.id === id);
  if (!recurso) {
    return (
      <AppTemplate>
        <div className="card card--sunken empty">
          <span className="empty__icon"><Icon name="buscar" size={26} /></span>
          <h1 className="card__title">No encontramos este recurso</h1>
          <p className="muted">Revisa tus otras recomendaciones.</p>
          <Button to="/dashboard">Ver mis recursos</Button>
        </div>
      </AppTemplate>
    );
  }
  return (
    <AppTemplate>
      <Button variant="link" size="sm" onClick={() => nav(-1)} className="back"><Icon name="izq" size={18} /> Volver</Button>
      <ResourceDetail recurso={recurso} onAction={(a) => (a === "aplicar" ? window.open(recurso.url_accion) : nav("/seguimiento"))} />
    </AppTemplate>
  );
}
