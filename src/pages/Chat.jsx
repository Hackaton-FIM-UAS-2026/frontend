import { useNavigate } from "react-router-dom";
import { AppTemplate } from "../components/templates";
import { AgentChat } from "../components/organisms";

export default function Chat() {
  const nav = useNavigate();
  return (
    <AppTemplate>
      <h1>Asistente</h1>
      <AgentChat onProponerCanalizacion={() => nav("/apoyo")} />
      <p className="small"><a href="/apoyo">Necesito otro tipo de apoyo</a></p>
    </AppTemplate>
  );
}
