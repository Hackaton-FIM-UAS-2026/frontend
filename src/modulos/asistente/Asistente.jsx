import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Icon } from "../../components/atoms";
import { AppHeader } from "../../components/organisms";
import { ResumenRecurso } from "./ResumenRecurso.jsx";
import { Chips, ConfirmarResumen, TarjetaEmergencia } from "./Acciones.jsx";
import { useDictado } from "./useDictado.js";
import { agendarVisita, canalizar, enviarMensaje, hayPeligro, LINEA } from "./servicio.js";
import "./estilos.css";

const CHIPS_INICIO = ["Busco trabajo", "Quiero un curso", "Necesito apoyo", "Hablar con una persona"];
const CONTACTO = ["WhatsApp", "Llamada", "Solo aquí", "Prefiero ir en persona"];
const salidaRapida = () => window.location.replace("https://www.google.com/search?q=clima+los+mochis");

const diaISO = (n) => { const d = new Date(); d.setDate(d.getDate() + n); return d.toLocaleDateString("en-CA"); };
const VISITAS = [
  ["Mañana en la mañana", 1, "mañana"], ["Mañana en la tarde", 1, "tarde"],
  ["Pasado mañana en la mañana", 2, "mañana"], ["Pasado mañana en la tarde", 2, "tarde"],
];
const MODULO = { juridica: "juridico", psicologica: "psicologia", ambas: "trabajo_social", no_se: "trabajo_social" };

let sec = 0;
const msg = (de, texto, extra = {}) => ({ id: ++sec, de, texto, ...extra });

export default function Asistente() {
  const nav = useNavigate();
  const reducir = useReducedMotion();
  const [msgs, setMsgs] = useState([msg("asistente", "Hola. Soy el asistente de SEMujeres. ¿En qué te ayudo?")]);
  const [chips, setChips] = useState(CHIPS_INICIO);
  const [texto, setTexto] = useState("");
  const [escribiendo, setEscribiendo] = useState(false);
  const [canal, setCanal] = useState(null);   // { paso, area, resumen, urgencia, medio }
  const [enviando, setEnviando] = useState(false);
  const fin = useRef(null);
  const dictado = useDictado((t) => setTexto((x) => (x ? `${x} ${t}` : t)));

  useEffect(() => {
    const esc = (e) => e.key === "Escape" && salidaRapida();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, []);
  useEffect(() => { fin.current?.scrollIntoView({ behavior: reducir ? "auto" : "smooth", block: "end" }); },
    [msgs, escribiendo, canal, chips, reducir]);

  const agregar = (...m) => setMsgs((x) => [...x, ...m]);

  const preguntar = async (t) => {
    const m = t.trim();
    if (!m || escribiendo) return;
    const historial = msgs.slice(-10).map((x) => ({ rol: x.de === "usuaria" ? "usuaria" : "asistente", texto: x.texto || "" }));
    agregar(msg("usuaria", m));
    setTexto(""); setChips(null); setCanal(null); setEscribiendo(true);
    try {
      const r = await enviarMensaje(m, historial);
      agregar(msg("asistente", r.texto, { recursos: r.recursos, emergencia: r.emergencia }));
      const conf = r.acciones?.find((a) => a.tipo === "confirmar_canalizacion");
      const ch = r.acciones?.find((a) => a.tipo === "chips");
      if (conf) setCanal({ paso: "ofrecer", ...conf });
      else if (ch) setChips(ch.opciones);
    } catch (e) {
      if (e.status === 401) return nav("/entrar");
      agregar(msg("asistente", "La conexión está lenta. Intenta de nuevo.",
        { emergencia: hayPeligro(m) ? LINEA : null }));
    } finally {
      setEscribiendo(false);
    }
  };

  const elegirContacto = (medio) => {
    agregar(msg("usuaria", medio));
    setCanal((c) => ({ ...c, paso: "resumen", medio }));
  };

  const enviarSolicitud = async (resumen) => {
    setEnviando(true);
    try {
      const enPersona = canal.medio === "Prefiero ir en persona";
      const r = await canalizar({
        area: canal.area, resumen, urgencia: canal.urgencia, consentimiento: true,
        contacto: { medio: enPersona ? "En persona" : canal.medio, horario: "", mensaje: false },
      });
      agregar(msg("aviso", `Listo. Tu folio es ${r.folio}. Una persona de SEMujeres te contactará en máximo 2 días hábiles.`),
        msg("asistente", enPersona ? "¿Qué día puedes ir? Te esperamos." : "Si prefieres ir en persona, dime qué día te queda y te esperamos."));
      setCanal((c) => ({ ...c, paso: "visita" }));
    } catch (e) {
      if (e.status === 401) return nav("/entrar");
      agregar(msg("asistente", "No pudimos enviar tu solicitud. Intenta de nuevo en un momento."));
    } finally {
      setEnviando(false);
    }
  };

  const elegirVisita = async (opcion) => {
    if (opcion === "No, gracias") { setCanal(null); setChips(CHIPS_INICIO.slice(0, 3)); return; }
    const [, dias, franja] = VISITAS.find(([t]) => t === opcion);
    agregar(msg("usuaria", opcion));
    try {
      await agendarVisita({ fecha: diaISO(dias), franja, modulo: MODULO[canal.area] || "trabajo_social" });
      agregar(msg("aviso", `Te esperamos ${opcion.toLowerCase()} en SEMujeres. Pregunta en recepción.`));
    } catch {
      agregar(msg("asistente", "No pudimos apartar tu visita. Puedes llegar a SEMujeres en horario de oficina."));
    }
    setCanal(null);
  };

  const salir = (
    <button type="button" className="m2-salida" onClick={salidaRapida}>
      <Icon name="x" size={16} strokeWidth="2.4" /> Salir rápido
    </button>
  );

  return (
    <div className="m2">
      <div className="m2-solo-pc"><AppHeader /></div>
      <header className="m2-head">
        <span className="m2-avatar" aria-hidden="true">S</span>
        <div><b>Asistente de SEMujeres</b><small>Asistente automático · 24 h</small></div>
        {salir}
      </header>

      <main id="contenido" className="m2-cuerpo">
        <div className="m2-cabecera-pc">
          <span className="m2-avatar" aria-hidden="true">S</span>
          <div><b>Asistente de SEMujeres</b><small>Asistente automático · disponible 24 h</small></div>
          {salir}
        </div>

        <div className="m2-msgs" aria-live="polite">
          <AnimatePresence initial={false}>
            {msgs.map((m) => (
              <motion.div key={m.id} className={`m2-item m2-item--${m.de}`}
                initial={{ opacity: 0, transform: "translateY(6px)" }} animate={{ opacity: 1, transform: "translateY(0px)" }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}>
                {m.de === "aviso"
                  ? <p className="m2-aviso" role="status"><Icon name="check" size={18} /> {m.texto}</p>
                  : <p className={`m2-burbuja m2-burbuja--${m.de}`}>{m.texto}</p>}
                {m.emergencia && <TarjetaEmergencia datos={m.emergencia} />}
                {m.recursos?.length > 0 && (
                  <div className="m2-recursos">{m.recursos.map((r) => <ResumenRecurso key={r.id} recurso={r} />)}</div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {escribiendo && <p className="m2-burbuja m2-burbuja--asistente m2-escribiendo" aria-label="El asistente está escribiendo"><i /><i /><i /></p>}

          {chips && !escribiendo && <Chips opciones={chips} onElegir={preguntar} />}

          {canal?.paso === "ofrecer" && (
            <div className="m2-fila m2-fila--col">
              <button type="button" className="btn btn--primary btn--block" onClick={() => {
                agregar(msg("usuaria", "Sí, que me contacten"), msg("asistente", "¿Cómo es seguro contactarte?"));
                setCanal((c) => ({ ...c, paso: "contacto" }));
              }}>Sí, que me contacten</button>
              <button type="button" className="btn btn--ghost btn--block" onClick={() => preguntar("Primero quiero saber más")}>
                Primero quiero saber más
              </button>
            </div>
          )}
          {canal?.paso === "contacto" && <Chips opciones={CONTACTO} onElegir={elegirContacto} />}
          {canal?.paso === "resumen" && <ConfirmarResumen resumen={canal.resumen} onEnviar={enviarSolicitud} enviando={enviando} />}
          {canal?.paso === "visita" && <Chips opciones={[...VISITAS.map(([t]) => t), "No, gracias"]} onElegir={elegirVisita} />}
          <div ref={fin} />
        </div>

        <form className="m2-form" onSubmit={(e) => { e.preventDefault(); preguntar(texto); }}>
          <label htmlFor="m2-texto" className="visually-hidden">Escribe tu mensaje</label>
          <input id="m2-texto" className="m2-campo" value={texto} onChange={(e) => setTexto(e.target.value)}
            placeholder="Escribe aquí…" autoComplete="off" maxLength={1000} />
          {dictado.disponible && (
            <button type="button" className={`m2-redondo m2-redondo--suave ${dictado.escuchando ? "m2-redondo--on" : ""}`}
              onClick={dictado.alternar} aria-label={dictado.escuchando ? "Dejar de dictar" : "Dictar con la voz"} aria-pressed={dictado.escuchando}>
              <Icon name="microfono" size={20} />
            </button>
          )}
          <button type="submit" className="m2-redondo" aria-label="Enviar" disabled={!texto.trim() || escribiendo}>
            <Icon name="enviar" size={20} />
          </button>
        </form>
      </main>
    </div>
  );
}
