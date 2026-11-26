import { Link } from "react-router-dom";
import { HomeTemplate } from "../../components/templates";
import { HeroSection } from "../../components/organisms";
import { BotonAsistente } from "../../components/molecules";
import { Button, Icon } from "../../components/atoms";
import { Cifras, EmpresasAliadas, Flujo, Pilar, POR_QUE, QUE_HACEMOS, Seccion, TarjetaPeligro, VIDA_REAL } from "./Bloques.jsx";

/** Landing: resumen de cada tema; el detalle vive en su página (/quienes-somos, etc.). */
export default function Landing() {
  return (
    <HomeTemplate>
      <HeroSection />
      <Seccion id="quienes" alt>
        <div className="m7-dos">
          <div>
            <h2 className="m7-titulo">Quiénes somos</h2>
            <p className="m7-lead">Empoderate es la plataforma de la <b>Secretaría de las Mujeres de Ahome (SEMujeres)</b>. SEMujeres da asesoría jurídica, psicológica y de trabajo social a mujeres, gratis. Empoderate lleva esa ayuda a tu celular y suma lo que te hace falta para salir adelante: trabajo, cursos y apoyos.</p>
            <Link to="/quienes-somos" className="m7-mas">Conoce más <Icon name="flecha" size={16} /></Link>
          </div>
          <Cifras />
        </div>
      </Seccion>
      <Seccion titulo="Por qué existimos" lead="Muchas mujeres quieren trabajar o aprender algo nuevo, pero no saben por dónde empezar. Y cuando alguien vive violencia, no tener ingresos propios hace más difícil salir de ella.">
        <div className="m7-tres">{POR_QUE.map(([i, t, d]) => <Pilar key={t} icono={i} titulo={t}>{d}</Pilar>)}</div>
      </Seccion>
      <Seccion alt titulo="Qué hacemos" lead="Tres cosas, en un solo lugar.">
        <div className="m7-tres">{QUE_HACEMOS.map(([i, t, d]) => <Pilar key={t} icono={i} titulo={t}>{d}</Pilar>)}</div>
        <Link to="/que-hacemos" className="m7-mas">Ver todo lo que hacemos <Icon name="flecha" size={16} /></Link>
      </Seccion>
      <Seccion id="como" titulo="Cómo funciona" lead="De entrar a dar tu primer paso.">
        <Flujo />
        <Link to="/como-funciona" className="m7-mas">Ver paso a paso y preguntas frecuentes <Icon name="flecha" size={16} /></Link>
      </Seccion>
      <Seccion alt titulo="Pensada para tu vida real">
        <div className="m7-cuatro">{VIDA_REAL.map(([i, t, d]) => <Pilar key={t} icono={i} titulo={t}>{d}</Pilar>)}</div>
      </Seccion>
      <Seccion id="empresas" className="m7-centro" titulo="Empresas que abren sus puertas" lead="Cada vacante la revisa una persona de SEMujeres antes de publicarse.">
        <EmpresasAliadas />
        <div className="m7-fila m7-fila--centro"><Button variant="ghost" to="/empresas/registro">Registra tu empresa</Button></div>
      </Seccion>
      <Seccion id="apoyo" marca>
        <div className="m7-dos">
          <div>
            <h2 className="m7-titulo">Apoyo jurídico y psicológico</h2>
            <p className="m7-lead">Si necesitas otro tipo de apoyo, pídelo cuando quieras desde el asistente. Nunca te lo preguntamos de entrada y nada se guarda sin tu permiso.</p>
            <ul className="m7-lista">
              <li>Tú decides si quieres que te contacte SEMujeres.</li>
              <li>Eliges cuándo y por dónde es seguro contactarte.</li>
              <li>Botón de salida rápida en todo momento.</li>
            </ul>
            <div className="m7-fila"><BotonAsistente variant="light" className="m7-auto" /></div>
          </div>
          <TarjetaPeligro />
        </div>
      </Seccion>
    </HomeTemplate>
  );
}
