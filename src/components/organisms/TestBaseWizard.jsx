import { useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { ProgressBar, Logo } from "../atoms";
import { QuestionCard, SectionStepper } from "../molecules";
import { TEST_BASE } from "../../data/campos";

export const SECCIONES = [
  { nombre: "Sobre ti", detalle: "Edad, lugar y estudios", campos: ["edad", "municipio", "escolaridad"],
    mensaje: "Empecemos por conocerte un poco." },
  { nombre: "Tu situación", detalle: "Dónde estás y a dónde quieres llegar", campos: ["situacion", "meta", "negocio"],
    mensaje: "No hay respuestas buenas o malas." },
  { nombre: "Tu tiempo", detalle: "Horas, horarios y cuidados", campos: ["horas_semana", "horario", "cuidados"],
    mensaje: "Buscaremos opciones que sí te cuadren." },
  { nombre: "Lo que tienes", detalle: "Conexión, habilidades y documentos", campos: ["dispositivo", "habilidades", "documentos"],
    mensaje: "Ya casi terminamos." },
];

// Transparencia: para qué se usa cada respuesta
const PORQUE = {
  edad: "Algunos apoyos piden una edad mínima.",
  municipio: "Para mostrarte opciones cerca de ti.",
  escolaridad: "Algunos cursos y vacantes la piden.",
  situacion: "Para saber desde dónde empezar.",
  meta: "Define tu ruta principal.",
  horas_semana: "Para no recomendarte algo que no puedas cumplir.",
  horario: "Para filtrar por horario.",
  cuidados: "Para cuidar tu tiempo y buscar horarios flexibles.",
  dispositivo: "Para elegir recursos que puedas usar desde tu celular.",
  habilidades: "Para acercarte oportunidades donde ya sabes hacer algo.",
  negocio: "Para saber si ya tienes algo avanzado.",
  documentos: "Algunos trámites los piden; podemos ayudarte a conseguirlos.",
};

export const seccionDe = (campo) => SECCIONES.findIndex((s) => s.campos.includes(campo));

// Marcas de sección en la barra de progreso (índice de pregunta donde empieza cada sección)
const MARCAS = SECCIONES.slice(1).map((s) => TEST_BASE.findIndex((q) => s.campos.includes(q.campo))).filter((n) => n > 0);

/** Panel lateral (escritorio) o encabezado compacto (celular) del test. */
export function QuizAside({ indice }) {
  const q = TEST_BASE[indice];
  const sec = Math.max(seccionDe(q.campo), 0);
  return (
    <div className="qaside">
      <div className="qaside__in">
        <Link to="/" className="qaside__logo" aria-label="Salir del test e ir al inicio"><Logo light /></Link>
        <div className="qaside__main" aria-live="polite">
          <p className="qaside__sec">Sección {sec + 1} de {SECCIONES.length}</p>
          <h1>{SECCIONES[sec].nombre}</h1>
          <p className="qaside__msg">{SECCIONES[sec].mensaje}</p>
        </div>
        <div className="qaside__steps"><SectionStepper secciones={SECCIONES} actual={sec} /></div>
      </div>
    </div>
  );
}

const variantes = {
  entra: (dir) => ({ opacity: 0, transform: `translateX(${dir * 24}px)` }),
  quieta: { opacity: 1, transform: "translateX(0px)" },
  sale: (dir) => ({ opacity: 0, transform: `translateX(${dir * -16}px)`, transition: { duration: 0.16, ease: [0.22, 1, 0.36, 1] } }),
};

/** Contenido del test: progreso + tarjeta de la pregunta actual con transición direccional. */
export function TestBaseWizard({ indice, respuestas, onChange, onNext, onBack }) {
  const q = TEST_BASE[indice];
  // Dirección del cambio (avanzar = 1, regresar = -1), derivada sin efectos
  const [track, setTrack] = useState({ i: indice, dir: 1 });
  if (track.i !== indice) setTrack({ i: indice, dir: indice > track.i ? 1 : -1 });
  const dir = track.i !== indice ? (indice > track.i ? 1 : -1) : track.dir;

  return (
    <div className="qwizard">
      <div className="qwizard__top">
        <span>Pregunta <strong>{indice + 1}</strong> de {TEST_BASE.length}</span>
        <span>Menos de 3 minutos</span>
      </div>
      <ProgressBar value={indice + 1} max={TEST_BASE.length} label="Avance del test" steps={MARCAS} />
      <div className="qwizard__stage">
        <AnimatePresence mode="popLayout" initial={false} custom={dir}>
          <motion.div key={q.campo} custom={dir} variants={variantes}
            initial="entra" animate="quieta" exit="sale"
            transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}>
            <QuestionCard
              numero={indice + 1}
              {...q}
              porque={PORQUE[q.campo]}
              valor={respuestas[q.campo]}
              onChange={(v) => onChange(q.campo, v)}
              onNext={onNext}
              onBack={indice > 0 ? onBack : null}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
