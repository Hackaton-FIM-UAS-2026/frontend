import { useNavigate } from "react-router-dom";
import { AppTemplate } from "../components/templates";
import { RouteSummary } from "../components/molecules";
import { Button } from "../components/atoms";
import { calcularRuta, NOMBRE_RUTA } from "../services/motorRuta";
import { leerExpediente, valores } from "../services/expediente";

export default function Resultado() {
  const nav = useNavigate();
  const ruta = calcularRuta(valores(leerExpediente()));
  // En producción: el LLM redacta ruta.factores; si tarda >6 s, esta plantilla.
  const explicacion = ruta.factores.length
    ? `Porque ${ruta.factores.slice(0, 3).join(", ").toLowerCase()}.`
    : `Te sugerimos ${NOMBRE_RUTA[ruta.principal]}.`;
  return (
    <AppTemplate>
      <RouteSummary ruta={ruta} explicacion={explicacion} />
      <div style={{ marginTop: 24 }}><Button block onClick={() => nav("/dashboard")}>Ver mis recursos</Button></div>
    </AppTemplate>
  );
}
