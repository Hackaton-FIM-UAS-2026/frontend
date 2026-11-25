/** Encabezado homologado de página: título, texto de apoyo, metadatos y acción opcional. */
export function PageHeader({ title, lead, meta, action, as: H = "h1" }) {
  return (
    <header className={`pagehead ${action ? "pagehead--split" : ""}`}>
      <H>{title}</H>
      {lead && <p className="pagehead__lead">{lead}</p>}
      {meta && <p className="pagehead__meta">{meta}</p>}
      {action && <div className="pagehead__action">{action}</div>}
    </header>
  );
}
