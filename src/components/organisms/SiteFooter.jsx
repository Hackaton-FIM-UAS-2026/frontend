import { Link } from "react-router-dom";
import { Logo } from "../atoms";

export function SiteFooter() {
  return (
    <footer className="sitefoot">
      <div className="sitefoot__in container">
        <div className="sitefoot__brand">
          <Logo light />
          <p>Ordenamos la oferta económica para cada mujer según su tiempo, sus habilidades y su acceso a internet.</p>
        </div>
        <div id="privacidad">
          <h3>Aviso de privacidad</h3>
          <p>Tratamos tus datos conforme a la LFPDPPP. Los datos sensibles solo se guardan con tu consentimiento expreso y puedes borrarlos cuando quieras.</p>
        </div>
        <div>
          <h3>Emergencias</h3>
          <p>Si estás en peligro ahora, llama al <a href="tel:911"><strong>911</strong></a>.</p>
          <p><Link to="/admin">Panel CEMujeres</Link></p>
        </div>
      </div>
      <p className="sitefoot__note container">Catálogo verificado en noviembre 2026 · Los Mochis, Sinaloa</p>
    </footer>
  );
}
