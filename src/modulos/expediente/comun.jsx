import { Badge, Icon } from "../../components/atoms";

export const URGENCIA = { inmediata: ["danger", "Inmediata"], pronta: ["warning", "Pronta"], informativa: ["info", "Informativa"] };
export const ORIGEN = { asistente: "Asistente", persona: "Pidió hablar con una persona", personal: "En persona" };

export function Urgencia({ valor }) {
  const [tono, txt] = URGENCIA[valor] || ["neutral", valor];
  return <Badge tone={tono}>{txt}</Badge>;
}

export function Candado({ children }) {
  return <p className="m4-candado"><Icon name="candado" size={18} /> {children}</p>;
}

export function Vacio({ children }) {
  return <p className="card card--sunken m4-vacio">{children}</p>;
}
