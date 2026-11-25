import { AppTemplate } from "../components/templates";
import { RouteSummary } from "../components/molecules";
import { Button, Icon } from "../components/atoms";
import { calcularRuta, NOMBRE_RUTA } from "../services/motorRuta";
import { leerExpediente, valores } from "../services/expediente";

export default function Resultado() {
  const ruta = calcularRuta(valores(leerExpediente()));
  // En producción: el LLM redacta ruta.factores; si tarda >6 s, esta plantilla.
  const explicacion = ruta.factores.length
    ? `Porque ${ruta.factores.slice(0, 3).join(", ").toLowerCase()}.`
    : `Te sugerimos ${NOMBRE_RUTA[ruta.principal]}.`;
  return (
    <AppTemplate>
      <RouteSummary ruta={ruta} explicacion={explicacion} />
      <div className="resultado__cta">
        <Button block to="/dashboard">Ver mis recursos <Icon name="flecha" size={18} /></Button>
      </div>
    </AppTemplate>
  );
}
