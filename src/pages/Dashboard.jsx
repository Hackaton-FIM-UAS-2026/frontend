import { useNavigate } from "react-router-dom";
import { AppTemplate } from "../components/templates";
import { ResourceDashboard } from "../components/organisms";
import { RECURSOS } from "../data/recursos";
import { calcularRuta } from "../services/motorRuta";
import { leerExpediente, valores } from "../services/expediente";

export default function Dashboard() {
  const nav = useNavigate();
  const ruta = calcularRuta(valores(leerExpediente()));
  const lista = RECURSOS.filter((r) => r.rutas.includes(ruta.principal) || r.rutas.includes(ruta.puente)).slice(0, 10);
  return (
    <AppTemplate>
      <h1>Tus recursos</h1>
      <ResourceDashboard recursos={lista.length ? lista : RECURSOS} onOpen={(id) => nav(`/recurso/${id}`)} />
    </AppTemplate>
  );
}
