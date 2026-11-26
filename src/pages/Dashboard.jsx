import { Navigate } from "react-router-dom";
import { destino } from "../modulos/registro";

// El inicio de la usuaria vive en el módulo M3 (src/modulos/caminos).
export default function Dashboard() {
  return <Navigate to={destino("/inicio", "/seguimiento")} replace />;
}
