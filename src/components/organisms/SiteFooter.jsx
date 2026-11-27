import { Link } from "react-router-dom";
import { Logo } from "../atoms";

export function SiteFooter() {
  return (
    <footer className="sitefoot">
      <div className="sitefoot__in container">
        <div className="sitefoot__brand">
          <Logo light />
          <p>Plataforma de la Secretaría de las Mujeres de Ahome (SEMujeres) · Los Mochis, Sinaloa.</p>
        </div>
        <div id="privacidad">
          <h3>Aviso de privacidad</h3>
          <p>Tratamos tus datos conforme a la ley de protección de datos personales. Lo privado solo se guarda con tu permiso y puedes borrarlo cuando quieras.</p>
          <p><Link to="/privacidad">Lee el aviso completo</Link></p>
        </div>
        <div>
          <h3>¿Estás en peligro?</h3>
          <p>Línea de SEMujeres: <a href="tel:+526681025080"><strong>668 102 5080</strong></a>. Si no contestan: <a href="tel:911">911</a>.</p>
          <p><Link to="/empresas">Empresas</Link> · <Link to="/empresa">Panel de empresas</Link> · <Link to="/admin">Panel SEMujeres</Link></p>
        </div>
      </div>
      <p className="sitefoot__note container">Datos de demostración · noviembre 2026</p>
    </footer>
  );
}
