import { useParams, useNavigate } from "react-router-dom";
import { AppTemplate } from "../components/templates";
import { ResourceDetail } from "../components/organisms";
import { RECURSOS } from "../data/recursos";

export default function RecursoDetalle() {
  const { id } = useParams();
  const nav = useNavigate();
  const recurso = RECURSOS.find((r) => r.id === id);
  if (!recurso) return <AppTemplate><p>No encontramos este recurso.</p></AppTemplate>;
  return (
    <AppTemplate>
      <ResourceDetail recurso={recurso} onAction={(a) => (a === "aplicar" ? window.open(recurso.url_accion) : nav("/seguimiento"))} />
    </AppTemplate>
  );
}
