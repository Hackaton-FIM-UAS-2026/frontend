import { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AppTemplate } from "../../components/templates";
import { ApiEstado, QuestionCard } from "../../components/molecules";
import { Button, Icon } from "../../components/atoms";
import { api, post } from "../../services/api";
import "./estilos.css";

const volverSeguro = (v) => (v && v.startsWith("/") && !v.startsWith("//") ? v : "/seguimiento");

/**
 * Entrevista dinámica: la IA elige la siguiente pregunta según lo que ya contó y la dice con naturalidad.
 * Campo y opciones salen del diccionario, así cada respuesta se guarda en su expediente.
 */
export default function CompletarPerfil() {
  const nav = useNavigate();
  const [params] = useSearchParams();
  const volver = volverSeguro(params.get("volver"));
  const [q, setQ] = useState(null);
  const [valor, setValor] = useState(undefined);
  const [n, setN] = useState(1);
  const [estado, setEstado] = useState({ cargando: true });

  const pedir = useCallback(async () => {
    setEstado({ cargando: true });
    try {
      const r = await post("/me/entrevista/siguiente", {});
      if (r.terminado) { setQ(null); setEstado({ terminado: true }); return; }
      setQ(r); setValor(undefined); setEstado({});
    } catch (e) { setEstado({ error: e }); }
  }, []);
  useEffect(() => { pedir(); }, [pedir]);

  const responder = async (v) => {
    const val = v ?? valor;
    if (val === undefined || (Array.isArray(val) && !val.length) || estado.guardando) return;
    setEstado({ guardando: true });
    try {
      await api.guardarCampos({ [q.campo]: val }, "entrevista");
      setN((x) => x + 1);
      await pedir();
    } catch (e) { setEstado({ error: e }); }
  };

  return (
    <AppTemplate>
      <Button variant="link" size="sm" className="m3-auto" onClick={() => nav(volver)}><Icon name="izq" size={18} /> Regresar</Button>
      <h1 className="m3-h1">Completa tu perfil</h1>
      {estado.terminado ? (
        <div className="card m3-vacio">
          <p className="m3-muted">¡Listo! Ya nos contaste todo lo que necesitamos. Con esto te recomendamos mejores opciones.</p>
          <Button onClick={() => nav(volver)}>Regresar</Button>
        </div>
      ) : estado.error ? (
        <ApiEstado error={estado.error} reintentar={pedir} />
      ) : !q ? (
        <ApiEstado cargando />
      ) : (
        <div className="m3-col">
          <p className="m3-muted">Pregunta {n} · te {q.faltan === 1 ? "falta 1" : `faltan ${q.faltan}`}. Puedes regresar cuando quieras; guardamos cada respuesta.</p>
          <QuestionCard key={`${q.campo}-${n}`} numero={n} pregunta={q.pregunta} porque={q.porque} tipo={q.tipo} opciones={q.opciones}
            valor={valor} onChange={setValor} onNext={responder} onBack={null} />
          {estado.guardando && <p className="m3-muted" role="status">Guardando…</p>}
        </div>
      )}
    </AppTemplate>
  );
}
