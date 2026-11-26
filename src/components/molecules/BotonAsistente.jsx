import { Button, Icon } from "../atoms";
import { destino } from "../../modulos/registro";

/** Acceso al asistente (M2). Texto fijo: "Chatea con nuestro asistente". */
export function BotonAsistente({ variant = "primary", className = "" }) {
  return (
    <Button block variant={variant} to={destino("/asistente", "/chat")} className={className}>
      <Icon name="chat" size={20} /> Chatea con nuestro asistente
    </Button>
  );
}
