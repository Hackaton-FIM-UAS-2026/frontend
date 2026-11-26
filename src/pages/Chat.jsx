import { Navigate } from "react-router-dom";

// El asistente vive en el módulo M2 (src/modulos/asistente).
export default function Chat() {
  return <Navigate to="/asistente" replace />;
}
