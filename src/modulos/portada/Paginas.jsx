import { Link } from "react-router-dom";
import { HomeTemplate } from "../../components/templates";
import { Button, Icon } from "../../components/atoms";
import { BotonAsistente } from "../../components/molecules";
import { Cifras, comenzar, EmpresasAliadas, Flujo, SigueCon, TarjetaPeligro } from "./Bloques.jsx";
import { VISITA } from "./datos.js";

function Pagina({ tema, intro, children }) {
  return (
    <HomeTemplate>
      <section className="m7-sec m7-pagina">
        <div className="container">
          <nav aria-label="Migas" className="m7-migas"><Link to="/">Inicio</Link> <Icon name="der" size={14} /> <span aria-current="page">{tema}</span></nav>
          <h1 className="m7-titulo m7-titulo--grande">{tema}</h1>
          <p className="m7-lead">{intro}</p>
          {children}
        </div>
      </section>
    </HomeTemplate>
  );
}

const AREAS = [
  ["usuarias", "Trabajo Social", "Primer contacto: escucha y orienta."],
  ["escudo", "Jurídico", "Pensión, divorcio, custodia, denuncia y acompañamiento."],
  ["corazon", "Psicología", "Terapia y atención en momentos difíciles."],
  ["libro", "Capacitación", "Pláticas de prevención en escuelas y comunidades."],
  ["maletin", "Empoderamiento económico", "Trabajo, cursos y apoyos."],
];

function Visitanos() {
  return (
    <div className="card card--sunken m7-visita">
      <h3>Visítanos</h3>
      <p><Icon name="ubicacion" size={16} /> {VISITA.direccion}</p>
      <p><Icon name="reloj" size={16} /> {VISITA.horario}</p>
    </div>
  );
}

export function QuienesSomos() {
  return (
    <Pagina tema="Quiénes somos" intro="Empoderate es la plataforma de la Secretaría de las Mujeres de Ahome. Junta en un solo lugar la atención de SEMujeres y las oportunidades para que las mujeres salgan adelante.">
      <div className="m7-dos">
        <div className="card m7-areas">
          <h2 className="m7-sub">Las áreas de SEMujeres</h2>
          <ul>{AREAS.map(([i, t, d]) => (
            <li key={t}><span className="m7-pilar__ic"><Icon name={i} size={20} /></span><span><b>{t}</b><small>{d}</small></span></li>
          ))}</ul>
        </div>
        <div className="m7-col"><Cifras /><Visitanos /></div>
      </div>
      <SigueCon to="/que-hacemos">Qué hacemos</SigueCon>
    </Pagina>
  );
}

const DETALLE = [
  ["ruta", "Te orientamos", "Según tu tiempo, tus estudios y lo que quieres lograr.",
    [["Cursos y talleres", "Excel, repostería, barismo, atención al cliente"], ["Becas", "Para terminar la prepa o estudiar algo nuevo"], ["Apoyos", "Para iniciar o hacer crecer tu negocio"]]],
  ["maletin", "Te conectamos", "Bolsa de trabajo con empresas de Ahome.",
    [["Vacantes revisadas", "Una persona de SEMujeres revisa cada una"], ["Te decimos qué te falta", "Y qué curso te ayuda a lograrlo"], ["Aplicas desde tu celular", "La empresa solo ve tus datos de trabajo"]]],
  ["corazon", "Te acompañamos", "Cuando necesitas más que una oportunidad.",
    [["Asesoría jurídica", "Pensión, divorcio, custodia, denuncia"], ["Apoyo psicológico", "Terapia y atención en momentos difíciles"], ["Sin repetir tu historia", "Un solo expediente para todas las áreas"]]],
];

export function QueHacemos() {
  return (
    <Pagina tema="Qué hacemos" intro="Te orientamos, te conectamos con empresas y te acompañamos. Todo gratis.">
      <div className="m7-tres">
        {DETALLE.map(([i, t, d, items]) => (
          <div key={t} className="card m7-detalle">
            <span className="m7-pilar__ic"><Icon name={i} size={22} /></span>
            <h2 className="m7-sub">{t}</h2>
            <p className="m7-peq">{d}</p>
            <ul className="m7-linea">{items.map(([a, b]) => <li key={a}>{a}<small>{b}</small></li>)}</ul>
          </div>
        ))}
      </div>
      <SigueCon to="/como-funciona">Cómo funciona</SigueCon>
    </Pagina>
  );
}

const FAQ = [
  ["¿Cuesta algo?", "No. Todo es gratis."],
  ["¿Necesito computadora?", "No. Funciona desde tu celular con pocos datos."],
  ["¿Quién ve mis datos?", "Solo el área de SEMujeres que te atiende. Las empresas solo ven tus datos de trabajo."],
  ["¿Puedo borrar mis datos?", "Sí, cuando quieras, desde el menú."],
];

export function ComoFunciona() {
  return (
    <Pagina tema="Cómo funciona" intro="De entrar a dar tu primer paso, en menos de 10 minutos.">
      <Flujo detalle />
      <h2 className="m7-sub m7-sub--sep">Preguntas frecuentes</h2>
      <div className="m7-faq">{FAQ.map(([p, r]) => <div key={p} className="card"><h3>{p}</h3><p>{r}</p></div>)}</div>
      <div className="m7-fila"><Button to={comenzar()}>Comenzar</Button></div>
      <SigueCon to="/empresas">Empresas</SigueCon>
    </Pagina>
  );
}

export function Empresas() {
  return (
    <Pagina tema="Empresas que abren sus puertas" intro="Empresas de Ahome que publican vacantes para mujeres. SEMujeres revisa cada empresa y cada vacante antes de publicarla.">
      <EmpresasAliadas />
      <div className="m7-dos m7-sep">
        <div>
          <h2 className="m7-sub">¿Tienes una empresa?</h2>
          <ul className="m7-linea">
            <li>Te registras<small>Nombre, RFC, giro y contacto</small></li>
            <li>SEMujeres revisa tu empresa<small>Una sola vez</small></li>
            <li>Publicas tus vacantes<small>Cada una se revisa antes de salir</small></li>
            <li>Recibes candidatas<small>Con sus datos de trabajo</small></li>
          </ul>
        </div>
        <div className="card card--brand m7-sumate">
          <h2 className="m7-sub">Súmate</h2>
          <p>Es gratis para tu empresa.</p>
          <Button block variant="light" to="/empresas/registro">Registra tu empresa</Button>
          <Link to="/empresa" className="m7-claro">Ya tengo cuenta: entrar al panel</Link>
        </div>
      </div>
      <SigueCon to="/apoyo">Apoyo</SigueCon>
    </Pagina>
  );
}

export function ApoyoInfo() {
  return (
    <Pagina tema="Apoyo jurídico y psicológico" intro="Si vives violencia o necesitas orientación legal o emocional, SEMujeres te atiende gratis. Tú decides cuándo y cómo.">
      <div className="m7-dos">
        <div className="m7-col">
          <div className="card"><h2 className="m7-sub">Cómo pedirlo</h2>
            <ul className="m7-linea">
              <li>Desde el asistente<small>Escribe «necesito apoyo» o «hablar con una persona»</small></li>
              <li>Eliges cómo es seguro contactarte<small>WhatsApp, llamada, solo en la app o en persona</small></li>
              <li>Recibes un folio<small>Te contactan en máximo 2 días hábiles</small></li>
            </ul>
            <BotonAsistente />
          </div>
          <div className="card"><h2 className="m7-sub">Tu privacidad</h2>
            <p className="m7-peq">Nada se guarda sin tu permiso. Solo el área que te atiende ve tu caso. Hay un botón de salida rápida en todo momento.</p></div>
        </div>
        <div className="m7-col"><TarjetaPeligro /><Visitanos /></div>
      </div>
      <div className="m7-sigue"><span>¿Lista para empezar?</span><Button to={comenzar()}>Comenzar <Icon name="flecha" size={18} /></Button></div>
    </Pagina>
  );
}

