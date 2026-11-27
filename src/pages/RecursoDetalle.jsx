import { useCallback, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppTemplate } from "../components/templates";
import { ResourceDetail } from "../components/organisms";
import { ApiEstado, Toast } from "../components/molecules";
import { Button, Icon } from "../components/atoms";
import { api } from "../services/api";
import { useApi } from "../services/useApi";
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
  const { datos: recurso, cargando, error, recargar } = useApi(() => api.recurso(id), [id]);
  const [aviso, setAviso] = useState(null);
  const cerrarAviso = useCallback(() => setAviso(null), []);
  // Mientras se envía, los botones se bloquean; el estado nuevo se muestra al instante sin esperar la recarga
  const [enviando, setEnviando] = useState(false);
  const enCurso = useRef(false);   // candado inmediato: dos taps seguidos llegan antes de que React re-renderice
  const [estadoLocal, setEstadoLocal] = useState(null);

  // Cada respuesta entra al expediente (fuente: entrevista) y el backend recalcula "¡Cumples!"
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
      setAviso(mensajeAccion(a, r, recurso?.tipo));
      recargar();
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
            enviando={enviando} onResponder={responder} onAction={accion} />
        : <ApiEstado cargando={cargando} error={error} reintentar={recargar} />}
      <Toast mensaje={aviso} onCerrar={cerrarAviso} />
    </AppTemplate>
  );
}
