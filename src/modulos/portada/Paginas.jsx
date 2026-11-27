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


const AVISO_OFICIAL = "https://transparencia.ahome.gob.mx/aip/Avisos_de_Privacidad/Aviso_Privacidad_Integral_Ahome.pdf";
const AVISOS_AHOME = "https://transparencia.ahome.gob.mx/avisos-de-privacidad/";
const PNT = "https://www.plataformadetransparencia.org.mx/";

/** /privacidad — aviso de privacidad de Empoderate en lenguaje claro. */
export function Privacidad() {
  return (
    <Pagina tema="Aviso de privacidad" intro="Qué datos guardamos, para qué los usamos y cómo puedes pedir que los corrijamos o los borremos.">
      <div className="m7-col m7-aviso">
        <p className="card card--sunken m7-peq" role="note">
          Versión pendiente de validación por SEMujeres. Mientras tanto, también aplica el{" "}
          <a href={AVISO_OFICIAL} target="_blank" rel="noopener">aviso de privacidad integral del Municipio de Ahome</a>.
        </p>
        <section className="card">
          <h2 className="m7-sub">Quién es responsable de tus datos</h2>
          <p>El H. Ayuntamiento de Ahome, a través de la Secretaría de las Mujeres (SEMujeres), en Los Mochis, Sinaloa,
            es responsable de los datos que nos das en Empoderate.</p>
        </section>
        <section className="card">
          <h2 className="m7-sub">Qué datos te pedimos</h2>
          <ul>
            <li>Tu nombre y tu correo, para crear tu cuenta, y tu teléfono si nos lo das.</li>
            <li>Si te registras en persona con el personal de SEMujeres: también tu CURP y tu colonia.</li>
            <li>Tus respuestas del test: edad, municipio, estudios, situación, meta, tiempo libre, personas a tu cargo,
              cómo te conectas, qué sabes hacer, si tienes negocio y qué documentos tienes (solo si los tienes, nunca el documento).</li>
            <li>Lo que contestas al revisar un curso, apoyo o vacante, y a qué aplicas o guardas.</li>
          </ul>
        </section>
        <section className="card">
          <h2 className="m7-sub">Datos sensibles</h2>
          <p>Solo si pides apoyo jurídico o psicológico, y solo con tu consentimiento expreso, guardamos el tipo de apoyo,
            tu forma segura de contacto y un resumen que tú apruebas. No guardamos tu conversación.
            Esta información solo la ve el área de SEMujeres que te atiende.</p>
        </section>
        <section className="card">
          <h2 className="m7-sub">Para qué los usamos</h2>
          <ul>
            <li>Mostrarte trabajos, cursos, becas y apoyos que te queden.</li>
            <li>Darte seguimiento y, si lo pides, que una especialista de SEMujeres te contacte.</li>
            <li>Hacer estadísticas sin nombres para mejorar los programas.</li>
          </ul>
        </section>
        <section className="card">
          <h2 className="m7-sub">Con quién se comparten</h2>
          <p>No vendemos ni compartimos tus datos. Solo se entregan si una autoridad competente los pide de forma fundada y motivada.</p>
          <p>Si aplicas a una vacante de una empresa registrada, esa empresa ve únicamente tu nombre, teléfono, escolaridad,
            habilidades y si tienes experiencia. Nunca ve tu CURP, tu colonia, tus cuidados ni nada de tu atención en SEMujeres.</p>
          <p>Para funcionar usamos proveedores de tecnología que solo procesan la información por encargo nuestro:
            almacenamiento de datos e inteligencia artificial. La inteligencia artificial recibe tus respuestas del test para
            elegir y explicarte opciones, y los mensajes que escribes en el asistente para responderte y detectar si necesitas
            apoyo urgente. No le enviamos el nombre de tu perfil.</p>
        </section>
        <section className="card">
          <h2 className="m7-sub">Tus derechos</h2>
          <p>Puedes pedir el acceso, la corrección o la cancelación de tus datos, oponerte a su uso o retirar tu consentimiento
            (derechos ARCO) ante la Unidad de Transparencia del Ayuntamiento de Ahome:</p>
          <ul>
            <li>Correo: <a href="mailto:transparencia@ahome.gob.mx">transparencia@ahome.gob.mx</a></li>
            <li>Teléfono: <a href="tel:+526688164000">(668) 816 4000</a>, ext. 1205 · lunes a viernes de 8:00 a 16:00</li>
            <li>En línea: <a href={PNT} target="_blank" rel="noopener">Plataforma Nacional de Transparencia</a></li>
          </ul>
          <p>Desde la app también puedes borrar tus datos privados cuando quieras, en <Link to="/seguimiento">Mi avance</Link>.</p>
        </section>
        <section className="card">
          <h2 className="m7-sub">Fundamento legal</h2>
          <p className="m7-peq">Artículos 6, apartado A, fracción II, y 16, segundo párrafo, de la Constitución Política de los Estados Unidos Mexicanos;
            Ley General de Protección de Datos Personales en Posesión de Sujetos Obligados; Ley de Protección de Datos Personales
            en Posesión de Sujetos Obligados del Estado de Sinaloa.</p>
          <p className="m7-peq">Avisos oficiales del municipio: <a href={AVISOS_AHOME} target="_blank" rel="noopener">transparencia.ahome.gob.mx/avisos-de-privacidad</a>.
            Si este aviso cambia, lo publicaremos en esta página.</p>
        </section>
      </div>
    </Pagina>
  );
}
