import { useState } from "react";
import { Avatar, Badge, Button, Icon, Input } from "../atoms";
import { Dialog, OptionButton } from "../molecules";
import { NOMBRE_RUTA } from "../../services/motorRuta";

/* ===== Seguimiento y contacto de usuarias (datos ficticios) ===== */

const DIA_HOY = 25; // demo: el panel está fechado el 25 de noviembre de 2026

/** Días desde la última actividad ("25 nov" → 0). */
export const diasSinActividad = (u) => Math.max(0, DIA_HOY - (parseInt(u.ultima, 10) || DIA_HOY));

/** Regla de seguimiento: nueva sin primer contacto, o 3+ días sin actividad. */
export const necesitaSeguimiento = (u) => u.estado === "Nueva" || diasSinActividad(u) >= 3;

export const textoDias = (d) => (d === 0 ? "Hoy" : d === 1 ? "Ayer" : `Hace ${d} días`);

const soloDigitos = (t = "") => t.replace(/\D/g, "");
const primerNombre = (n) => n.split(" ")[0];

const MEDIOS = {
  WhatsApp: { icon: "whatsapp", accion: "Abrir WhatsApp", href: (u, msg) => `https://wa.me/52${soloDigitos(u.contacto.telefono)}?text=${encodeURIComponent(msg)}` },
  Llamada: { icon: "telefono", accion: "Llamar", href: (u) => `tel:+52${soloDigitos(u.contacto.telefono)}` },
  Correo: { icon: "correo", accion: "Escribir correo", href: (u, msg) => `mailto:${u.contacto.correo}?subject=${encodeURIComponent("Seguimiento de Empoderate")}&body=${encodeURIComponent(msg)}` },
};

const plantilla = (u) =>
  `Hola ${primerNombre(u.nombre)}, te saluda Ana Torres, asesora de CEMujeres. Te escribo por tu registro en Empoderate. ` +
  `¿Tienes unos minutos para platicar sobre tus recomendaciones de ${NOMBRE_RUTA[u.ruta].toLowerCase()}?`;

/** Lista del dashboard: a quién toca dar seguimiento hoy. */
export function SeguimientoList({ usuarias, onAbrir, onContactar }) {
  if (!usuarias.length) return <p className="muted">Todas las usuarias tienen seguimiento al día.</p>;
  return (
    <ul className="segui">
      {usuarias.map((u) => {
        const d = diasSinActividad(u);
        return (
          <li key={u.id} className="segui__item">
            <Avatar nombre={u.nombre} size={40} />
            <button type="button" className="segui__who" onClick={() => onAbrir(u.id)}>
              <strong>{u.nombre}</strong>
              <small>{u.estado === "Nueva" ? "Sin primer contacto" : "Sin actividad"} · {textoDias(d)}</small>
            </button>
            <Badge tone={u.ruta}>{NOMBRE_RUTA[u.ruta]}</Badge>
            <Button size="sm" variant="quiet" onClick={() => onContactar(u.id)}>
              <Icon name={MEDIOS[u.contacto.medio]?.icon || "telefono"} size={16} /> Contactar
            </Button>
          </li>
        );
      })}
    </ul>
  );
}

/** Tarjeta de contacto en la ficha de la usuaria. */
export function ContactoCard({ usuaria, onContactar }) {
  const c = usuaria.contacto;
  return (
    <div className="contacto">
      <dl className="contacto__datos">
        <div><dt>Teléfono</dt><dd><a href={`tel:+52${soloDigitos(c.telefono)}`}>{c.telefono}</a></dd></div>
        <div><dt>Correo</dt><dd><a href={`mailto:${c.correo}`}>{c.correo}</a></dd></div>
        <div><dt>Prefiere</dt><dd><Icon name={MEDIOS[c.medio]?.icon} size={16} /> {c.medio}</dd></div>
        <div><dt>Mejor horario</dt><dd>{c.horario}</dd></div>
      </dl>
      <Button block onClick={onContactar}><Icon name={MEDIOS[c.medio]?.icon || "telefono"} size={18} /> Contactar a {primerNombre(usuaria.nombre)}</Button>
    </div>
  );
}

const RESULTADOS = ["Contestó", "No contestó", "Dejé mensaje", "Pidió que la contacten después"];

/** Diálogo para contactar y dejar registro del contacto en la línea de tiempo. */
export function ContactarDialog({ usuaria, abierto, onCerrar, onRegistrar }) {
  const [medio, setMedio] = useState(usuaria?.contacto.medio || "WhatsApp");
  const [mensaje, setMensaje] = useState(usuaria ? plantilla(usuaria) : "");
  const [resultado, setResultado] = useState("");
  const [nota, setNota] = useState("");
  const [abrio, setAbrio] = useState(false);
  if (!usuaria) return null;
  const m = MEDIOS[medio];

  return (
    <Dialog abierto={abierto} onCerrar={onCerrar}
      titulo={`Contactar a ${usuaria.nombre}`}
      descripcion={`Prefiere ${usuaria.contacto.medio.toLowerCase()} · ${usuaria.contacto.horario.toLowerCase()}`}
      onSubmit={() => onRegistrar(usuaria.id, { medio, resultado, nota })}
      acciones={<>
        <Button variant="ghost" onClick={onCerrar}>Cancelar</Button>
        <Button type="submit" disabled={!resultado}>Registrar contacto</Button>
      </>}>
      <div className="contactar">
        <div className="chips" role="radiogroup" aria-label="Medio de contacto">
          {Object.keys(MEDIOS).map((k) => (
            <button key={k} type="button" className="chip" role="radio" aria-checked={medio === k} onClick={() => setMedio(k)}>
              <Icon name={MEDIOS[k].icon} size={16} /> {k}{k === usuaria.contacto.medio && <span className="chip__n">· prefiere</span>}
            </button>
          ))}
        </div>

        {medio !== "Llamada" && (
          <Input as="textarea" label="Mensaje" rows="4" value={mensaje} onChange={(e) => setMensaje(e.target.value)}
            hint="Lenguaje neutro: no menciones temas sensibles por este medio." />
        )}

        <a className="btn btn--secondary btn--block" href={m.href(usuaria, mensaje)} target="_blank" rel="noreferrer" onClick={() => setAbrio(true)}>
          <Icon name={m.icon} size={18} /> {m.accion}
          <span className="contactar__dato">{medio === "Correo" ? usuaria.contacto.correo : usuaria.contacto.telefono}</span>
        </a>

        <fieldset className={`contactar__registro ${abrio ? "contactar__registro--on" : ""}`}>
          <legend className="field__label">¿Cómo te fue?</legend>
          <div className="opts opts--2" role="radiogroup" aria-label="Resultado del contacto">
            {RESULTADOS.map((r) => <OptionButton key={r} compact role="radio" label={r} active={resultado === r} onClick={() => setResultado(r)} />)}
          </div>
          <Input as="textarea" label="Nota (opcional)" rows="2" value={nota} onChange={(e) => setNota(e.target.value)} className="contactar__nota" />
        </fieldset>
      </div>
    </Dialog>
  );
}

const FUENTES = [
  ["todas", "Todo"],
  ["usuaria", "De ella"],
  ["personal_cemujeres", "Del equipo"],
  ["test_base", "Test"],
];
const ICONO_FUENTE = { usuaria: "usuaria", personal_cemujeres: "usuarias", test_base: "check" };
const TEXTO_FUENTE = { usuaria: "Usuaria", personal_cemujeres: "Equipo CEMujeres", test_base: "Test base" };

/** Línea de tiempo de actividad con filtro por origen. */
export function ActividadTimeline({ historial }) {
  const [filtro, setFiltro] = useState("todas");
  const lista = filtro === "todas" ? historial : historial.filter((h) => h.fuente === filtro);
  return (
    <>
      <div className="chips timeline__filtros" role="group" aria-label="Filtrar actividad">
        {FUENTES.map(([k, l]) => {
          const n = k === "todas" ? historial.length : historial.filter((h) => h.fuente === k).length;
          return (
            <button key={k} type="button" className="chip" aria-pressed={filtro === k} onClick={() => setFiltro(k)}>
              {l} <span className="chip__n">{n}</span>
            </button>
          );
        })}
      </div>
      <ul className="timeline">
        {lista.map((h, i) => (
          <li key={`${h.fecha}-${i}`} className={`timeline__item timeline__item--${h.fuente}`}>
            <span className="timeline__icon"><Icon name={ICONO_FUENTE[h.fuente] || "reloj"} size={14} /></span>
            <div>
              <p>{h.texto}</p>
              <small>{h.fecha} · {TEXTO_FUENTE[h.fuente] || h.fuente}</small>
            </div>
          </li>
        ))}
        {!lista.length && <li className="muted small">Sin actividad de este tipo.</li>}
      </ul>
    </>
  );
}
