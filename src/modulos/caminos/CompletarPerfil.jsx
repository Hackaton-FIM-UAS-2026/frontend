import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AppTemplate } from "../../components/templates";
import { ApiEstado, QuestionCard } from "../../components/molecules";
import { Button, Icon, ProgressBar } from "../../components/atoms";
import { TEST_BASE } from "../../data/campos";
import { api } from "../../services/api";
import "./estilos.css";

const volverSeguro = (v) => (v && v.startsWith("/") && !v.startsWith("//") ? v : "/seguimiento");

/** Pregunta solo los datos que faltan en su perfil y la regresa a donde estaba. */
export default function CompletarPerfil() {
  const nav = useNavigate();
  const [params] = useSearchParams();
  const volver = volverSeguro(params.get("volver"));
  const [faltan, setFaltan] = useState(null);
  const [error, setError] = useState(null);
  const [i, setI] = useState(0);
  const [resp, setResp] = useState({});
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    Promise.all([api.expediente(), api.diccionario()])
      .then(([exp, dic]) => {
        const tiene = new Set(Object.keys(exp.campos || {}));
        const entrevista = Object.entries(dic.preguntas || {}).map(([campo, p]) => ({ campo, tipo: "unica", ...p }));
        setFaltan([...TEST_BASE, ...entrevista].filter((q) => !tiene.has(q.campo)));
      })
      .catch(setError);
  }, []);

  const q = useMemo(() => faltan?.[i], [faltan, i]);

  const siguiente = async (valor) => {
    const v = valor ?? resp[q.campo];
    if (v === undefined || (Array.isArray(v) && !v.length) || guardando) return;
    setGuardando(true);
    try {
      await api.guardarCampos({ [q.campo]: v }, "entrevista");
      if (i + 1 < faltan.length) setI(i + 1);
      else nav(volver, { replace: true });
    } catch (e) {
      setError(e);
    } finally {
      setGuardando(false);
    }
  };

  if (!faltan) return <AppTemplate><ApiEstado cargando={!error} error={error} reintentar={() => window.location.reload()} /></AppTemplate>;

  return (
    <AppTemplate>
      <Button variant="link" size="sm" className="m3-auto" onClick={() => nav(volver)}><Icon name="izq" size={18} /> Regresar</Button>
      <h1 className="m3-h1">Completa tu perfil</h1>
      {!faltan.length ? (
        <div className="card m3-vacio">
          <p className="m3-muted">Tu perfil ya está completo. ¡Gracias!</p>
          <Button onClick={() => nav(volver)}>Regresar</Button>
        </div>
      ) : (
        <div className="m3-col">
          <p className="m3-muted">Te faltan {faltan.length - i} {faltan.length - i === 1 ? "dato" : "datos"}. Solo te preguntamos lo que aún no sabemos.</p>
          <ProgressBar value={i} max={faltan.length} label="Avance" />
          <QuestionCard key={q.campo} numero={i + 1} {...q} valor={resp[q.campo]}
            onChange={(v) => setResp((r) => ({ ...r, [q.campo]: v }))}
            onNext={siguiente} onBack={i > 0 ? () => setI(i - 1) : null} />
          {error && <p className="m3-muted" role="alert">No pudimos guardar tu respuesta. Intenta de nuevo.</p>}
        </div>
      )}
    </AppTemplate>
  );
}
