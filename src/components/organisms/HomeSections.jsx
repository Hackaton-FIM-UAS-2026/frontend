import { Link, useNavigate } from "react-router-dom";
import { Button } from "../atoms";
import { FeatureCard, StepItem, ResourceTypeTile, EmergencyBanner } from "../molecules";

export function RoutesSection() {
  return (
    <section id="rutas" className="sec">
      <h2 className="sec__title">Tres rutas que se pueden combinar</h2>
      <p className="sec__lead">Capacitación muchas veces es un puente hacia un empleo o un negocio. Te mostramos una ruta principal y, si hace falta, una ruta puente.</p>
      <div className="grid3">
        <FeatureCard icon="maletin" title="Empleabilidad" tone="turquesa">Vacantes y primer empleo que se ajustan a tus horarios.</FeatureCard>
        <FeatureCard icon="ruta" title="Emprendimiento" tone="naranja">Iniciar o hacer crecer tu negocio, con apoyos y financiamiento.</FeatureCard>
        <FeatureCard icon="libro" title="Capacitación" tone="magenta">Cursos y becas para aprender algo nuevo o prepararte para lo siguiente.</FeatureCard>
      </div>
    </section>
  );
}

export function HowItWorks() {
  return (
    <section id="como" className="sec sec--alt">
      <h2 className="sec__title">¿Cómo funciona?</h2>
      <ol className="steps">
        <StepItem n="1" title="Regístrate">Con tu correo o teléfono y tu consentimiento al aviso de privacidad.</StepItem>
        <StepItem n="2" title="Contesta el test">12 preguntas cerradas, menos de 3 minutos.</StepItem>
        <StepItem n="3" title="Conoce tu ruta">Te explicamos por qué es la que más te conviene.</StepItem>
        <StepItem n="4" title="Elige un recurso">Te decimos qué ya cumples y qué te falta, y preguntamos solo lo necesario.</StepItem>
        <StepItem n="5" title="Da el paso">Aplica, inscríbete o guarda el recurso para después.</StepItem>
      </ol>
      <Link to="/registro"><Button>Comenzar mi test</Button></Link>
    </section>
  );
}

export function ResourceTypes() {
  const nav = useNavigate();
  const tipos = [["libro", "Cursos"], ["maletin", "Vacantes"], ["beca", "Becas"], ["corazon", "Apoyos"], ["moneda", "Financiamiento"]];
  return (
    <section id="recursos" className="sec">
      <h2 className="sec__title">Recursos para ti</h2>
      <p className="sec__lead">Reunimos en un solo lugar la oferta de secretarías, empresas y organizaciones de Ahome, Sinaloa y de todo el país en línea.</p>
      <div className="tiles">
        {tipos.map(([icon, label]) => <ResourceTypeTile key={label} icon={icon} label={label} onClick={() => nav("/registro")} />)}
      </div>
    </section>
  );
}

export function ContextSection() {
  return (
    <section className="sec sec--alt">
      <h2 className="sec__title">Pensada para tu vida real</h2>
      <div className="grid4">
        <FeatureCard icon="reloj" title="Tu tiempo y tus cuidados" tone="mostaza">Preguntamos tus horas y horarios, y si cuidas a alguien. Filtramos por modalidad.</FeatureCard>
        <FeatureCard icon="wifi" title="Pocos datos móviles" tone="oliva">App ligera, sin videos automáticos y con tu avance guardado sin conexión.</FeatureCard>
        <FeatureCard icon="libro" title="Lenguaje claro" tone="turquesa">Frases cortas y sin tecnicismos. Puedes agrandar el texto cuando quieras.</FeatureCard>
        <FeatureCard icon="candado" title="Tus datos, contigo" tone="morado">Consentimiento explícito. No pedimos datos sensibles si un recurso no los necesita.</FeatureCard>
      </div>
    </section>
  );
}

export function SupportSection() {
  return (
    <section id="apoyo" className="sec">
      <div className="support">
        <div>
          <h2 className="sec__title">Apoyo jurídico y psicológico</h2>
          <p>Si necesitas otro tipo de apoyo, puedes pedirlo en cualquier momento desde el asistente.
             Nunca te lo preguntamos de entrada y nada se guarda sin tu confirmación.</p>
          <ul className="support__list">
            <li>Tú decides si quieres que te contacte una especialista de CEMujeres.</li>
            <li>Eliges cuándo y por dónde es seguro contactarte.</li>
            <li>Botón de salida rápida y avisos discretos.</li>
          </ul>
          <Link to="/apoyo"><Button variant="secondary">Necesito otro tipo de apoyo</Button></Link>
        </div>
        <EmergencyBanner />
      </div>
    </section>
  );
}
