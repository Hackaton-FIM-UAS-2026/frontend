import { AppTemplate } from "../components/templates";
import { RouteSummary, ApiEstado } from "../components/molecules";
import { Button, Icon } from "../components/atoms";
import { api } from "../services/api";
import { useApi } from "../services/useApi";

export default function Resultado() {
  // El backend decide la ruta (con regla de puente) y Claude/plantilla redacta la explicación
  const { datos: ruta, cargando, error, recargar } = useApi(api.ruta);
  return (
    <AppTemplate>
      {ruta ? <RouteSummary ruta={ruta} explicacion={ruta.explicacion} factores={ruta.factores} />
        : <ApiEstado cargando={cargando} error={error} reintentar={recargar} />}
      <div className="resultado__cta">
        <Button block to="/dashboard">Ver mis recursos <Icon name="flecha" size={18} /></Button>
      </div>
    </AppTemplate>
  );
}
