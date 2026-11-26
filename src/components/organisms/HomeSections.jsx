import { useNavigate } from "react-router-dom";
import { Button, Icon } from "../atoms";
import { StepItem, ResourceTypeTile, EmergencyBanner } from "../molecules";

const RUTAS = [
  ["empleabilidad", "Empleabilidad", "maletin", "Vacantes y primer empleo que se ajustan a tus horarios."],
  ["emprendimiento", "Emprendimiento", "ruta", "Iniciar o hacer crecer tu negocio, con apoyos y financiamiento."],
  ["capacitacion", "Capacitación", "libro", "Cursos y becas para aprender algo nuevo o prepararte para lo siguiente."],
];

export function RoutesSection() {
  return (
    <section id="rutas" className="sec">
      <div className="container sec__split">
        <div className="sec__intro">
          <h2 className="sec__title">Tres rutas que se pueden combinar</h2>
          <p className="sec__lead">Capacitación muchas veces es un puente hacia un empleo o un negocio. Te mostramos una ruta principal y, si hace falta, una ruta puente.</p>
        </div>
        <ul className="rutas">
          {RUTAS.map(([id, nombre, icon, texto]) => (
            <li key={id} className={`ruta ruta--${id}`}>
              <span className="ruta__icon"><Icon name={icon} size={22} /></span>
              <div>
                <h3>{nombre}</h3>
                <p>{texto}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function HowItWorks() {
  return (
    <section id="como" className="sec sec--alt">
      <div className="container sec__split">
        <div className="sec__intro">
          <h2 className="sec__title">¿Cómo funciona?</h2>
          <p className="sec__lead">Cinco pasos, de tu registro a tu primera acción.</p>
          <Button to="/registro" className="sec__cta">Comenzar mi test</Button>
        </div>
        <ol className="steps">
          <StepItem n="1" title="Regístrate">Con tu correo o teléfono y tu consentimiento al aviso de privacidad.</StepItem>
          <StepItem n="2" title="Contesta el test">12 preguntas cerradas, menos de 3 minutos.</StepItem>
          <StepItem n="3" title="Conoce tu ruta">Te explicamos por qué es la que más te conviene.</StepItem>
          <StepItem n="4" title="Elige un recurso">Te decimos qué ya cumples y qué te falta, y preguntamos solo lo necesario.</StepItem>
          <StepItem n="5" title="Da el paso">Aplica, inscríbete o guarda el recurso para después.</StepItem>
        </ol>
      </div>
    </section>
  );
}

export function ResourceTypes() {
  const nav = useNavigate();
  const tipos = [["libro", "Cursos"], ["maletin", "Vacantes"], ["beca", "Becas"], ["corazon", "Apoyos"], ["moneda", "Financiamiento"]];
  return (
    <section id="recursos" className="sec">
      <div className="container">
        <h2 className="sec__title">Recursos para ti</h2>
        <p className="sec__lead">Reunimos en un solo lugar la oferta de secretarías, empresas y organizaciones de Ahome, Sinaloa y de todo el país en línea.</p>
        <div className="tiles">
          {tipos.map(([icon, label]) => <ResourceTypeTile key={label} icon={icon} label={label} onClick={() => nav("/registro")} />)}
        </div>
      </div>
    </section>
  );
}

const CONTEXTO = [
  ["reloj", "Tu tiempo y tus cuidados", "Preguntamos tus horas y horarios, y si cuidas a alguien. Filtramos por modalidad."],
  ["wifi", "Pocos datos móviles", "App ligera, sin videos automáticos y con tu avance guardado sin conexión."],
  ["texto", "Lenguaje claro", "Frases cortas y sin tecnicismos. Puedes agrandar el texto cuando quieras."],
  ["candado", "Tus datos, contigo", "Consentimiento explícito. No pedimos datos sensibles si un recurso no los necesita."],
];

export function ContextSection() {
  return (
    <section className="sec sec--alt">
      <div className="container">
        <h2 className="sec__title">Pensada para tu vida real</h2>
        <ul className="contexto">
          {CONTEXTO.map(([icon, titulo, texto]) => (
            <li key={titulo}>
              <Icon name={icon} size={26} />
              <h3>{titulo}</h3>
              <p>{texto}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function SupportSection() {
  return (
    <section id="apoyo" className="sec">
      <div className="container">
        <div className="support">
          <div className="support__text">
            <h2 className="sec__title">Apoyo jurídico y psicológico</h2>
            <p>Si necesitas otro tipo de apoyo, puedes pedirlo en cualquier momento desde el asistente.
               Nunca te lo preguntamos de entrada y nada se guarda sin tu confirmación.</p>
            <ul className="support__list">
              <li><Icon name="check" size={18} /> Tú decides si quieres que te contacte una especialista de SEMujeres.</li>
              <li><Icon name="check" size={18} /> Eliges cuándo y por dónde es seguro contactarte.</li>
              <li><Icon name="check" size={18} /> Botón de salida rápida y avisos discretos.</li>
            </ul>
            <Button to="/apoyo" variant="secondary">Necesito otro tipo de apoyo</Button>
          </div>
          <EmergencyBanner />
        </div>
      </div>
    </section>
  );
}
