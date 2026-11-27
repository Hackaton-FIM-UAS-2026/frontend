import { AppTemplate } from "../../components/templates";
import { ApiEstado, BotonAsistente } from "../../components/molecules";
import { Button, Icon } from "../../components/atoms";
import { useApi } from "../../services/useApi";
import { caminos as pedirCaminos } from "./servicio.js";
import { Avance, Tarjeta } from "./Tarjeta.jsx";
import "./estilos.css";
import { enFrase } from "../../services/texto";

function Camino({ c }) {
  const faltas = c.puentes.filter((p) => p.motivo === "te_falta");
  const tema = c.puentes.filter((p) => p.motivo === "tema");
  return (
    <div className="m3-camino">
      <Tarjeta r={c.meta}><Avance cumplidos={c.meta.cumplidos} total={c.meta.total} /></Tarjeta>
      {c.puentes.length > 0 && (
        <div className="m3-puente">
          {faltas.map((p) => (
            <div key={p.recurso.id} className="m3-puente__paso">
              <span className="m3-puente__lbl">Para lograrlo te falta: {enFrase(p.para)}</span>
              <Tarjeta r={p.recurso} />
            </div>
          ))}
          {tema.map((p) => (
            <div key={p.recurso.id} className="m3-puente__paso">
              <span className="m3-puente__lbl">Te ayuda también</span>
              <Tarjeta r={p.recurso} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Inicio() {
  const { datos, cargando, error, recargar } = useApi(pedirCaminos);
  if (!datos) return <AppTemplate wide><ApiEstado cargando={cargando} error={error} reintentar={recargar} /></AppTemplate>;
  const saludo = datos.nombre ? `Hola, ${datos.nombre}` : "Hola";

  if (datos.falta_test) return (
    <AppTemplate wide>
      <h1 className="m3-h1">{saludo}</h1>
      <div className="card m3-vacio">
        <span className="m3-vacio__ic"><Icon name="lapiz" size={26} /></span>
        <h2 className="m3-h2">Cuéntanos de ti en 3 minutos</h2>
        <p className="m3-muted">Con 12 preguntas te mostramos el trabajo, curso, beca o apoyo que más te conviene.</p>
        <Button to="/test">Empezar</Button>
      </div>
      <BotonAsistente variant="ghost" className="m3-asistente-movil" />
    </AppTemplate>
  );

  return (
    <AppTemplate wide>
      <h1 className="m3-h1">{saludo}</h1>
      <div className="m3-inicio">
        <div className="m3-col">
          <div className="m3-solo-movil"><BotonAsistente /></div>
          <h2 className="m3-seccion">Tus caminos</h2>
          {datos.caminos.length
            ? datos.caminos.map((c) => <Camino key={c.meta.id} c={c} />)
            : <p className="card card--sunken m3-muted">Por ahora no encontramos opciones para ti. Pregúntale a nuestro asistente o revisa «Explorar».</p>}
        </div>
        <aside className="m3-col">
          <div className="card card--brand m3-dudas m3-solo-pc">
            <h2 className="m3-dudas__t">¿Tienes dudas?</h2>
            <p className="m3-dudas__p">Te ayudamos a elegir o a pedir apoyo.</p>
            <BotonAsistente variant="light" />
          </div>
          {datos.tambien.length > 0 && <>
            <h2 className="m3-seccion">También te puede interesar</h2>
            {datos.tambien.map((r) => <Tarjeta key={r.id} r={r} />)}
          </>}
        </aside>
      </div>
    </AppTemplate>
  );
}
