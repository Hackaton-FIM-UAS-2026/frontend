import { Navigate } from "react-router-dom";

// La entrada vive en el módulo M1 (src/modulos/entrada). Se conserva la ruta vieja por enlaces guardados.
export default function Registro() {
  return <Navigate to="/entrar" replace />;
}
