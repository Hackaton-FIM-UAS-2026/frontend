import { useRef, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { AppTemplate } from "../components/templates";
import { ResourceDetail } from "../components/organisms";
import { ApiEstado } from "../components/molecules";
import { Button, Icon } from "../components/atoms";
import { api } from "../services/api";
import { useApi } from "../services/useApi";
import { avisar } from "../services/avisos";
import { destino } from "../modulos/registro";

const AGREGADO = { curso: "Curso agregado", beca: "Beca agregada", apoyo: "Apoyo agregado", financiamiento: "Apoyo agregado" };

function mensajeAccion(accion, r, tipo) {
  if (r.nuevo === false) return "Ya lo tenías registrado";
  if (accion === "guardar") return "Guardado para después";
  return tipo === "vacante" ? `Listo, aplicaste a «${r.titulo}»` : AGREGADO[tipo] || "Agregado a tu avance";
}

export default function RecursoDetalle() {
  const { id } = useParams();
  const nav = useNavigate();
  const { key } = useLocation();
  const { datos: recurso, cargando, error, recargar } = useApi(() => api.recurso(id), [id]);
  // Mientras se envía, los botones se bloquean; el estado nuevo se muestra al instante sin esperar la recarga
  const [enviando, setEnviando] = useState(false);
  const enCurso = useRef(false);   // candado inmediato: dos taps seguidos llegan antes de que React re-renderice
  const [estadoLocal, setEstadoLocal] = useState(null);

  // Todas las respuestas entran juntas al expediente (fuente: entrevista) y el backend recalcula "¡Cumples!"
  const responderTodo = async (respuestas) => {
    try {
      await api.guardarCampos(respuestas, "entrevista");
      recargar();
    } catch (e) {
      alert(e.message || "No pudimos guardar tus respuestas.");
      throw e;
    }
  };
  const responder = async (campo, valor) => {
    try {
      await api.guardarCampos({ [campo]: valor }, "entrevista");
      recargar();
    } catch (e) {
      alert(e.message || "No pudimos guardar tu respuesta.");
    }
  };

  const accion = async (a) => {
    if (enCurso.current) return;
    enCurso.current = true;
    setEnviando(true);
    try {
      const r = await api.accion(id, a);
      if (a === "aplicar" && r.url_accion && r.url_accion !== "#") window.open(r.url_accion, "_blank", "noopener");
      setEstadoLocal({ id, estado: r.estado });
      avisar(mensajeAccion(a, r, recurso?.tipo));
      // Si llegó desde otra pantalla de la app (chat, Inicio, Explorar…), regresa a ella
      if (r.nuevo && key !== "default") nav(-1);
      else recargar();
    } catch (e) {
      alert(e.message || "No pudimos registrar la acción.");
    } finally {
      enCurso.current = false;
      setEnviando(false);
    }
  };

  if (error?.status === 404 || (!cargando && !error && !recurso)) {
    return (
      <AppTemplate>
        <div className="card card--sunken empty">
          <span className="empty__icon"><Icon name="buscar" size={26} /></span>
          <h1 className="card__title">No encontramos esta opción</h1>
          <p className="muted">Revisa tus otras opciones.</p>
          <Button to={destino("/inicio", "/dashboard")}>Ver mis opciones</Button>
        </div>
      </AppTemplate>
    );
  }
  return (
    <AppTemplate>
      <Button variant="link" size="sm" onClick={() => nav(-1)} className="back"><Icon name="izq" size={18} /> Volver</Button>
      {recurso
        ? <ResourceDetail key={recurso.id} recurso={{ ...recurso, mi_estado: (estadoLocal?.id === id && estadoLocal.estado) || recurso.mi_estado }}
            enviando={enviando} onResponderTodo={responderTodo} onAction={accion} />
        : <ApiEstado cargando={cargando} error={error} reintentar={recargar} />}
    </AppTemplate>
  );
}
