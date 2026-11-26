import { Badge } from "../../components/atoms";

export const ESTADO = { pendiente: ["warning", "En revisión"], aprobada: ["success", "Publicada"], rechazada: ["danger", "No aprobada"] };
export const ESTADO_EMPRESA = { pendiente: ["warning", "En revisión"], aprobada: ["success", "Empresa aprobada"], rechazada: ["danger", "No aprobada"] };

export function Estado({ valor, empresa }) {
  const [tono, txt] = (empresa ? ESTADO_EMPRESA : ESTADO)[valor] || ["neutral", valor];
  return <Badge tone={tono}>{txt}</Badge>;
}
