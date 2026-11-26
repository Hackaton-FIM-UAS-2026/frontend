import { useState } from "react";
import { Badge, Button, Icon, Input } from "../atoms";
import { Dialog } from "../molecules";
import { DICCIONARIO_PREGUNTAS } from "../../data/campos";

/* ===== Ofertas de trabajo: listado y editor ===== */

const MODALIDADES = ["Presencial", "En línea", "Híbrida"];
const HORARIOS = ["Mañanas", "Tardes", "Noches", "Fines de semana", "Flexible"];
const HOY = "2026-11-25";

const fechaCorta = (iso) => {
  if (!iso) return "Sin fecha";
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("es-MX", { day: "numeric", month: "short", year: "numeric" });
};
const diasPara = (iso) => (iso ? Math.round((new Date(iso) - new Date(HOY)) / 86400000) : null);

export function estadoOferta(o) {
  const d = diasPara(o.fecha_cierre);
  if (o.publicada === false) return { tone: "neutral", label: "En pausa" };
  if (d !== null && d < 0) return { tone: "danger", label: "Cerrada" };
  if (d !== null && d <= 14) return { tone: "warning", label: `Cierra en ${d} d` };
  return { tone: "success", label: "Publicada" };
}

export function OfertasTable({ ofertas, onEditar, onPublicar }) {
  return (
    <div className="tablewrap">
      <table className="dt dt--stack">
        <thead>
          <tr><th>Oferta</th><th>Modalidad</th><th>Horario</th><th>Cierre</th><th>Estado</th><th><span className="visually-hidden">Acciones</span></th></tr>
        </thead>
        <tbody>
          {ofertas.map((o) => {
            const e = estadoOferta(o);
            return (
              <tr key={o.id}>
                <td className="dt__main">
                  <strong>{o.titulo}</strong><br />
                  <small className="muted">{o.proveedor}{o.costo && o.costo !== "Sueldo" ? ` · ${o.costo}` : ""}</small>
                </td>
                <td data-label="Modalidad">{o.modalidad}<br /><small className="muted">{o.ubicacion}</small></td>
                <td data-label="Horario">{o.horario}<br /><small className="muted">{o.horas_semana ? `${o.horas_semana} h/sem` : ""}</small></td>
                <td data-label="Cierre">{fechaCorta(o.fecha_cierre)}</td>
                <td data-label="Estado"><Badge tone={e.tone} dot>{e.label}</Badge></td>
                <td className="dt__end">
                  <span className="dt__acciones">
                    <button type="button" className="dt__link" onClick={() => onEditar(o)}>Editar</button>
                    <button type="button" className="dt__link dt__link--quiet" onClick={() => onPublicar(o.id, o.publicada === false)}>
                      {o.publicada === false ? "Publicar" : "Pausar"}
                    </button>
                  </span>
                </td>
              </tr>
            );
          })}
          {!ofertas.length && <tr><td colSpan="6" className="dt__empty">No hay ofertas con este filtro.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}

const VACIA = {
  titulo: "", proveedor: "", modalidad: "Presencial", horario: "Mañanas", horas_semana: "",
  costo: "", ubicacion: "Los Mochis", fecha_cierre: "", url_accion: "", rutas: ["empleabilidad"],
  requisitos: [], publicada: true,
};

const VERIFICA = Object.entries(DICCIONARIO_PREGUNTAS).map(([campo, p]) => [campo, p.pregunta]);

/** Editor de oferta (crear o editar). Montar con `key` para reiniciar el formulario. */
export function OfertaEditor({ oferta, abierto, onCerrar, onGuardar }) {
  const editando = Boolean(oferta?.id);
  const [f, setF] = useState(() => ({
    ...VACIA, ...(oferta || {}),
    costo: oferta?.costo === "Sueldo" ? "" : oferta?.costo || "",
    url_accion: oferta?.url_accion === "#" ? "" : oferta?.url_accion || "",
    horas_semana: oferta?.horas_semana ?? "",
  }));
  const [errores, setErrores] = useState({});
  const set = (k) => (e) => setF({ ...f, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value });

  const setReq = (i, cambios) => setF({ ...f, requisitos: f.requisitos.map((r, n) => (n === i ? { ...r, ...cambios } : r)) });
  const addReq = () => setF({ ...f, requisitos: [...f.requisitos, { campo: `req_${Date.now().toString(36)}`, ok: null, label: "", duro: false }] });
  const delReq = (i) => setF({ ...f, requisitos: f.requisitos.filter((_, n) => n !== i) });
  const capacitacion = f.rutas.includes("capacitacion");

  const validar = () => {
    const e = {};
    if (!f.titulo.trim()) e.titulo = "Escribe el puesto.";
    if (!f.proveedor.trim()) e.proveedor = "Escribe quién ofrece el empleo.";
    if (f.horas_semana && (Number(f.horas_semana) < 1 || Number(f.horas_semana) > 60)) e.horas_semana = "Entre 1 y 60 horas.";
    if (f.url_accion && !/^https?:\/\//.test(f.url_accion)) e.url_accion = "El enlace debe empezar con https://";
    if (f.requisitos.some((r) => !r.label.trim())) e.requisitos = "Completa o quita los requisitos vacíos.";
    return e;
  };

  const guardar = () => {
    const e = validar();
    setErrores(e);
    if (Object.keys(e).length) return;
    onGuardar({
      ...f,
      titulo: f.titulo.trim(),
      proveedor: f.proveedor.trim(),
      tipo: "vacante",
      horas_semana: f.horas_semana ? Number(f.horas_semana) : null,
      costo: f.costo.trim() || "Sueldo",
      url_accion: f.url_accion || "#",
      requisitos: f.requisitos.map((r) => ({ ...r, label: r.label.trim() })),
    });
  };

  return (
    <Dialog abierto={abierto} onCerrar={onCerrar} ancho onSubmit={guardar}
      titulo={editando ? "Editar oferta de trabajo" : "Nueva oferta de trabajo"}
      descripcion="Las usuarias con ruta de empleabilidad la verán en sus recursos mientras esté publicada."
      acciones={<>
        <Button variant="ghost" onClick={onCerrar}>Cancelar</Button>
        <Button type="submit">{editando ? "Guardar cambios" : "Publicar oferta"}</Button>
      </>}>
      <div className="oferta-form">
        <Input label="Puesto" value={f.titulo} onChange={set("titulo")} error={errores.titulo}
          placeholder="Por ejemplo: Auxiliar de cocina (medio tiempo)" className="of--full" autoFocus />
        <Input label="Empresa u organización" value={f.proveedor} onChange={set("proveedor")} error={errores.proveedor} className="of--full" />
        <Input as="select" label="Modalidad" value={f.modalidad} onChange={set("modalidad")}>
          {MODALIDADES.map((m) => <option key={m}>{m}</option>)}
        </Input>
        <Input as="select" label="Horario" value={f.horario} onChange={set("horario")}>
          {HORARIOS.map((m) => <option key={m}>{m}</option>)}
        </Input>
        <Input label="Horas a la semana" type="number" inputMode="numeric" min="1" max="60"
          value={f.horas_semana ?? ""} onChange={set("horas_semana")} error={errores.horas_semana} />
        <Input label="Sueldo" value={f.costo} onChange={set("costo")} placeholder="Por ejemplo: $7,500 al mes" hint="Opcional." />
        <Input label="Ubicación" value={f.ubicacion} onChange={set("ubicacion")} />
        <Input label="Fecha de cierre" type="date" value={f.fecha_cierre} onChange={set("fecha_cierre")} min={HOY} />
        <Input label="Enlace para aplicar" type="url" value={f.url_accion} onChange={set("url_accion")}
          placeholder="https://" error={errores.url_accion} hint="Opcional. Si no hay, la asesora da seguimiento." className="of--full" />

        <fieldset className="of--full of__reqs">
          <legend className="field__label">Requisitos</legend>
          {f.requisitos.length === 0 && <p className="muted small">Sin requisitos. Agrega solo lo indispensable.</p>}
          {f.requisitos.map((r, i) => (
            <div key={i} className="of__req">
              <input className="input" aria-label={`Requisito ${i + 1}`} value={r.label} placeholder="Por ejemplo: Secundaria terminada"
                onChange={(e) => setReq(i, { label: e.target.value })} />
              <select className="input" aria-label={`Cómo se verifica el requisito ${i + 1}`}
                value={DICCIONARIO_PREGUNTAS[r.campo] ? r.campo : ""}
                onChange={(e) => setReq(i, { campo: e.target.value || `req_${Date.now().toString(36)}` })}>
                <option value="">Lo revisa la asesora</option>
                {VERIFICA.map(([campo, p]) => <option key={campo} value={campo}>Preguntar: {p}</option>)}
              </select>
              <button type="button" className="of__del" onClick={() => delReq(i)} aria-label={`Quitar requisito ${i + 1}`}><Icon name="x" size={18} /></button>
            </div>
          ))}
          {errores.requisitos && <span className="field__error">{errores.requisitos}</span>}
          <Button variant="quiet" size="sm" onClick={addReq}><Icon name="mas" size={16} /> Agregar requisito</Button>
        </fieldset>

        <div className="of--full of__switches">
          <label className="check-row">
            <input type="checkbox" checked={capacitacion}
              onChange={(e) => setF({ ...f, rutas: e.target.checked ? ["empleabilidad", "capacitacion"] : ["empleabilidad"] })} />
            <span>Incluye capacitación (también se muestra a la ruta de capacitación)</span>
          </label>
          <label className="check-row">
            <input type="checkbox" checked={f.publicada !== false} onChange={set("publicada")} />
            <span>Publicada: visible para las usuarias</span>
          </label>
        </div>
      </div>
    </Dialog>
  );
}
