import { useNavigate } from "react-router-dom";
import { FocusTemplate } from "../components/templates";
import { SensitiveFlow } from "../components/organisms";
import { api } from "../services/api";

export default function Apoyo() {
  const nav = useNavigate();
  const terminar = async (datos) => {
    // null = "No, gracias": no se guarda nada
    if (datos) {
      try {
        await api.canalizar({ tipo: datos.tipo, contacto: datos.contacto, consentimiento: true });
      } catch (e) {
        if (e.status === 401) return nav("/registro");
        alert(e.message || "No pudimos enviar tu solicitud. Intenta de nuevo.");
        return;
      }
    }
    nav("/dashboard");
  };
  return (
    <FocusTemplate>
      {/* Notificaciones neutras: nunca mostrar el tema fuera de esta pantalla */}
      <SensitiveFlow onDone={terminar} />
    </FocusTemplate>
  );
}
