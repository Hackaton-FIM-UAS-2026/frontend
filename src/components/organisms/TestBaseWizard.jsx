import { ProgressBar, Logo, Pattern, ArcosIlustracion } from "../atoms";
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

/** Panel lateral (escritorio) o encabezado (celular) del test. */
export function QuizAside({ indice }) {
  const q = TEST_BASE[indice];
  const sec = Math.max(seccionDe(q.campo), 0);
  return (
    <div className="qaside">
      <Pattern color="#fff" opacity={0.08} />
      <div className="qaside__in">
        <Logo light />
        <div className="qaside__main">
          <p className="qaside__eyebrow">Sección {sec + 1} de {SECCIONES.length}</p>
          <h1>{SECCIONES[sec].nombre}</h1>
          <p className="qaside__msg">{SECCIONES[sec].mensaje}</p>
        </div>
        <div className="qaside__steps"><SectionStepper secciones={SECCIONES} actual={sec} /></div>
        <div className="qaside__art"><ArcosIlustracion /></div>
      </div>
    </div>
  );
}

/** Contenido del test: progreso + tarjeta de la pregunta actual. */
export function TestBaseWizard({ indice, respuestas, onChange, onNext, onBack }) {
  const q = TEST_BASE[indice];
  return (
    <div className="qwizard">
      <div className="qwizard__top">
        <span>Pregunta {indice + 1} de {TEST_BASE.length}</span>
        <span>Menos de 3 minutos</span>
      </div>
      <ProgressBar value={indice + 1} max={TEST_BASE.length} label="Avance del test" />
      <QuestionCard
        key={q.campo}
        numero={indice + 1}
        {...q}
        porque={PORQUE[q.campo]}
        valor={respuestas[q.campo]}
        onChange={(v) => onChange(q.campo, v)}
        onNext={onNext}
        onBack={indice > 0 ? onBack : null}
      />
    </div>
  );
}
