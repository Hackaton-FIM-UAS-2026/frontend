import { useNavigate } from "react-router-dom";
import { FocusTemplate } from "../components/templates";
import { SensitiveFlow } from "../components/organisms";

export default function Apoyo() {
  const nav = useNavigate();
  return (
    <FocusTemplate>
      {/* Notificaciones neutras: nunca mostrar el tema fuera de esta pantalla */}
      <SensitiveFlow onDone={() => nav("/dashboard")} />
    </FocusTemplate>
  );
}
