import { Navigate } from "react-router-dom";
import { Button } from "../atoms";

/** Estados comunes de una lectura a la API: cargando, sin sesión (401) y error con reintento. */
export function ApiEstado({ cargando, error, reintentar }) {
  if (cargando) return <p className="muted">Cargando…</p>;
  if (error?.status === 401) return <Navigate to="/registro" replace />;
  if (error) {
    return (
      <div className="card card--sunken empty">
        <p className="muted">{error.message || "Algo salió mal."}</p>
        {reintentar && <Button onClick={reintentar}>Reintentar</Button>}
      </div>
    );
  }
  return null;
}
