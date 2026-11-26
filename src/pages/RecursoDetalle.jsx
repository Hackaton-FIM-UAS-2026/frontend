import { useParams, useNavigate } from "react-router-dom";
import { AppTemplate } from "../components/templates";
import { ResourceDetail } from "../components/organisms";
import { ApiEstado } from "../components/molecules";
import { Button, Icon } from "../components/atoms";
import { api } from "../services/api";
import { useApi } from "../services/useApi";
import { destino } from "../modulos/registro";

export default function RecursoDetalle() {
  const { id } = useParams();
  const nav = useNavigate();
  const { datos: recurso, cargando, error, recargar } = useApi(() => api.recurso(id), [id]);

  // Cada respuesta entra al expediente (fuente: entrevista) y el backend recalcula "¡Cumples!"
  const responder = async (campo, valor) => {
    try {
      await api.guardarCampos({ [campo]: valor }, "entrevista");
      recargar();
    } catch (e) {
      alert(e.message || "No pudimos guardar tu respuesta.");
    }
  };

  const accion = async (a) => {
    try {
      const r = await api.accion(id, a);
      if (a === "aplicar" && r.url_accion && r.url_accion !== "#") window.open(r.url_accion, "_blank", "noopener");
      else if (a === "guardar") nav("/seguimiento");
      else recargar();
    } catch (e) {
      alert(e.message || "No pudimos registrar la acción.");
    }
  };

  if (error?.status === 404 || (!cargando && !error && !recurso)) {
    return (
      <AppTemplate>
        <div className="card card--sunken empty">
          <span className="empty__icon"><Icon name="buscar" size={26} /></span>
          <h1 className="card__title">No encontramos esta opción</h1>
          <p className="muted">Revisa tus otras opciones.</p>
          <Button to={destino("/inicio", "/dashboard")}>Ver mis opciones</Button>
        </div>
      </AppTemplate>
    );
  }
  return (
    <AppTemplate>
      <Button variant="link" size="sm" onClick={() => nav(-1)} className="back"><Icon name="izq" size={18} /> Volver</Button>
      {recurso
        ?<ResourceDetail key={recurso.id} recurso={recurso} onResponder={responder} onAction={accion} />
        : <ApiEstado cargando={cargando} error={error} reintentar={recargar} />}
    </AppTemplate>
  );
}
