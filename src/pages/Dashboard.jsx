import { useNavigate } from "react-router-dom";
import { AppTemplate } from "../components/templates";
import { ResourceDashboard } from "../components/organisms";
import { PageHeader } from "../components/molecules";
import { Badge } from "../components/atoms";
import { RECURSOS } from "../data/recursos";
import { calcularRuta, NOMBRE_RUTA } from "../services/motorRuta";
import { leerExpediente, valores } from "../services/expediente";

export default function Dashboard() {
  const nav = useNavigate();
  const ruta = calcularRuta(valores(leerExpediente()));
  const lista = RECURSOS.filter((r) => r.rutas.includes(ruta.principal) || r.rutas.includes(ruta.puente)).slice(0, 10);
  return (
    <AppTemplate wide>
      <PageHeader
        title="Tus recursos"
        lead="Elegidos según tu ruta."
        meta={<>
          <Badge tone={ruta.principal} dot>{NOMBRE_RUTA[ruta.principal]}</Badge>
          {ruta.puente && <Badge tone={ruta.puente} dot>Puente: {NOMBRE_RUTA[ruta.puente]}</Badge>}
        </>}
      />
      <ResourceDashboard recursos={lista.length ? lista : RECURSOS} onOpen={(id) => nav(`/recurso/${id}`)} />
    </AppTemplate>
  );
}
