import { useNavigate } from "react-router-dom";
import { AppTemplate } from "../components/templates";
import { ResourceDashboard } from "../components/organisms";
import { PageHeader, ApiEstado } from "../components/molecules";
import { Badge } from "../components/atoms";
import { NOMBRE_RUTA } from "../services/motorRuta";
import { api } from "../services/api";
import { useApi } from "../services/useApi";

export default function Dashboard() {
  const nav = useNavigate();
  const { datos, cargando, error, recargar } = useApi(api.recomendaciones);
  const ruta = datos?.ruta;
  return (
    <AppTemplate wide>
      <PageHeader
        title="Tus recursos"
        lead="Elegidos según tu ruta."
        meta={ruta && <>
          <Badge tone={ruta.principal} dot>{NOMBRE_RUTA[ruta.principal]}</Badge>
          {ruta.puente && <Badge tone={ruta.puente} dot>Puente: {NOMBRE_RUTA[ruta.puente]}</Badge>}
        </>}
      />
      {datos ? <ResourceDashboard recursos={datos.recursos} onOpen={(id) => nav(`/recurso/${id}`)} />
        : <ApiEstado cargando={cargando} error={error} reintentar={recargar} />}
    </AppTemplate>
  );
}
