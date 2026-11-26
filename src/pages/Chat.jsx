import { useNavigate, Link } from "react-router-dom";
import { AppTemplate } from "../components/templates";
import { AgentChat } from "../components/organisms";
import { PageHeader } from "../components/molecules";

export default function Chat() {
  const nav = useNavigate();
  return (
    <AppTemplate>
      <PageHeader title="Asistente" lead="Pregúntame sobre tus recomendaciones." />
      <AgentChat onProponerCanalizacion={() => nav("/apoyo")} onSinSesion={() => nav("/registro")} />
      <p className="small chat__apoyo"><Link to="/apoyo">Necesito otro tipo de apoyo</Link></p>
    </AppTemplate>
  );
}
