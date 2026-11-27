import { useState } from "react";
import { AppTemplate } from "../components/templates";
import { ApiEstado, Dialog } from "../components/molecules";
import { Button, Icon } from "../components/atoms";
import { api } from "../services/api";
import { useApi } from "../services/useApi";
import "../modulos/caminos/estilos.css";

const ESTADO = { aplicado: "Aplicaste", guardado: "Guardada para después", inscrita: "Te inscribiste", terminado: "Terminaste", contratada: "¡Te contrataron!" };
const TIPO = { vacante: ["Vacante", "vacante"], curso: ["Curso", "curso"], beca: ["Beca", "apoyo"], apoyo: ["Apoyo", "apoyo"], financiamiento: ["Apoyo", "apoyo"] };
const FILTROS = [["todo", "Todo"], ["vacante", "Vacantes"], ["curso", "Cursos"], ["apoyo", "Becas y apoyos"]];
const PASOS = ["Recibida", "Asignada", "En atención", "Concluida"];
const PASO = { nueva: 0, asignada: 1, contactada: 2, "en atención": 2, cerrada: 3 };
const VISIBLES = 6;

const fmt = (v) => (Array.isArray(v) ? v.join(", ") : String(v));

/** Solicitud a SEMujeres con sus pasos. */
function Solicitud({ c }) {
  const paso = PASO[c.estado] ?? 0;
  return (
    <li className="m3-sol">
      <div className="m3-sol__cab">
        <span className="m3-sol__depto">{c.departamento}</span>
        <span className="m3-sol__folio">Folio {c.folio} · {c.fecha}</span>
      </div>
      <ol className="m3-pasos" aria-label={`Estado: ${c.estado_texto}`}>
        {PASOS.map((p, i) => (
          <li key={p} className={i < paso ? "m3-pasos--hecho" : i === paso ? "m3-pasos--actual" : ""} aria-current={i === paso ? "step" : undefined}>
            <span className="m3-pasos__punto" aria-hidden="true">{i < paso && <Icon name="check" size={12} strokeWidth="3" />}</span>
            <span className="m3-pasos__t">{p}</span>
          </li>
        ))}
      </ol>
      <p className="m3-sol__nota">{c.estado_texto}</p>
    </li>
  );
}

export default function Seguimiento() {
  const { datos: s, cargando, error, recargar } = useApi(async () => {
    const [seg, canal, exp, dic] = await Promise.all([
      api.seguimiento(), api.misCanalizaciones().catch(() => []), api.expediente().catch(() => ({ campos: {} })), api.diccionario().catch(() => ({ etiquetas: {} })),
    ]);
    return { ...seg, canalizaciones: canal, campos: exp.campos || {}, etiquetas: dic.etiquetas || {} };
  });
  const [filtro, setFiltro] = useState("todo");
  const [todoPerfil, setTodoPerfil] = useState(false);
  const [borrar, setBorrar] = useState(false);
  const [aviso, setAviso] = useState("");

  const confirmarBorrado = async () => {
    try { await api.borrarSensible(); setAviso("Listo. Borramos tus datos privados."); recargar(); }
    catch { setAviso("No pudimos borrarlos ahora. Intenta más tarde."); }
    setBorrar(false);
  };

  if (!s) return <AppTemplate><ApiEstado cargando={cargando} error={error} reintentar={recargar} /></AppTemplate>;

  const acciones = s.recursos.map((r) => ({ ...r, cat: (TIPO[r.tipo] || TIPO.apoyo)[1] }));
  const conteo = Object.fromEntries(FILTROS.map(([k]) => [k, k === "todo" ? acciones.length : acciones.filter((a) => a.cat === k).length]));
  const lista = filtro === "todo" ? acciones : acciones.filter((a) => a.cat === filtro);
  const respuestas = Object.entries(s.campos)
    .filter(([k, c]) => s.etiquetas[k] && c && c.valor !== undefined && c.valor !== null && c.valor !== "")
    .map(([k, c]) => [s.etiquetas[k], fmt(c.valor)]);
  const pct = s.total ? Math.min(100, Math.round((s.datos_guardados / s.total) * 100)) : 0;
  const enMarcha = s.canalizaciones.filter((c) => c.estado !== "cerrada").length + acciones.filter((a) => a.estado !== "guardado").length;

  return (
    <AppTemplate wide>
      <header className="m3-av-cab">
        <h1 className="m3-h1">Mi avance</h1>
        <p className="m3-av-lead">
          {enMarcha ? `Tienes ${enMarcha} ${enMarcha === 1 ? "cosa en marcha" : "cosas en marcha"}. Aquí ves en qué va cada una.` : "Aquí verás en qué va todo lo que hagas en Empoderate."}
        </p>
      </header>

      <div className="m3-av">
        <div className="m3-av__col">
          {s.canalizaciones.length > 0 && (
            <section className="card m3-av-sec" aria-labelledby="sol-t">
              <h2 id="sol-t" className="m3-h2">Tus solicitudes a SEMujeres</h2>
              <ul className="m3-sols">{s.canalizaciones.map((c) => <Solicitud key={c.folio} c={c} />)}</ul>
            </section>
          )}

          <section className="card m3-av-sec" aria-labelledby="hecho-t">
            <h2 id="hecho-t" className="m3-h2">Lo que has hecho</h2>
            {acciones.length > 0 && (
              <div className="m3-chips" role="tablist" aria-label="Filtrar">
                {FILTROS.filter(([k]) => k === "todo" || conteo[k]).map(([k, t]) => (
                  <button key={k} type="button" role="tab" aria-selected={filtro === k} className={`m3-chip ${filtro === k ? "m3-chip--on" : ""}`}
                    onClick={() => setFiltro(k)}>{t} <span className="m3-chip__n">{conteo[k]}</span></button>
                ))}
              </div>
            )}
            {lista.length ? (
              <ul className="m3-filas">
                {lista.map((a) => {
                  const [etq, tono] = TIPO[a.tipo] || TIPO.apoyo;
                  return (
                    <li key={a.id} className="m3-fila">
                      <span className={`m3-tipo m3-tipo--${tono}`}>{etq}</span>
                      <span className="m3-fila__t">
                        <span className="m3-fila__titulo">{a.titulo}</span>
                        <span className={`m3-fila__estado ${a.estado === "contratada" ? "m3-fila__estado--logro" : ""}`}>{ESTADO[a.estado] || a.estado}</span>
                      </span>
                      <span className="m3-fila__fecha">{a.fecha}</span>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="m3-vacio-av">
                <p>Cuando apliques a una vacante, te inscribas a un curso o guardes una opción, aparecerá aquí.</p>
                <Button size="sm" variant="quiet" to="/explorar">Explorar opciones</Button>
              </div>
            )}
          </section>
        </div>

        <div className="m3-av__col">
          <section className="card m3-av-sec" aria-labelledby="perfil-t">
            <div className="m3-av-sec__cab">
              <h2 id="perfil-t" className="m3-h2">Tu perfil</h2>
              <span className="m3-av-pct">{pct}%</span>
            </div>
            <div className="m3-barra m3-barra--perfil" role="progressbar" aria-valuemin={0} aria-valuemax={s.total} aria-valuenow={s.datos_guardados}
              aria-label="Avance de tu perfil"><i style={{ width: `${pct}%` }} /></div>
            <p className="m3-muted">{s.datos_guardados} de {s.total} datos. Entre más nos cuentes, mejores opciones te damos.</p>
            {s.datos_guardados < s.total && (
              <Button variant="quiet" size="sm" to="/completar-perfil?volver=/seguimiento" className="m3-auto">Completar mi perfil</Button>
            )}
            {respuestas.length > 0 && (
              <>
                <h3 className="m3-av-sub">Lo que nos has contado</h3>
                <dl className="m3-respuestas">
                  {(todoPerfil ? respuestas : respuestas.slice(0, VISIBLES)).map(([k, v]) => (
                    <div key={k}><dt>{k}</dt><dd>{v}</dd></div>
                  ))}
                </dl>
                {respuestas.length > VISIBLES && (
                  <Button variant="link" size="sm" className="m3-auto" onClick={() => setTodoPerfil(!todoPerfil)}>
                    {todoPerfil ? "Ver menos" : `Ver todo (${respuestas.length})`}
                  </Button>
                )}
              </>
            )}
          </section>

          <section className="m3-av-privado" aria-labelledby="datos-t" id="mis-datos">
            <h2 id="datos-t" className="m3-av-sub">Tus datos</h2>
            <p className="m3-muted">Tú decides qué guardamos. Puedes borrar tus datos privados cuando quieras.</p>
            {aviso && <p role="status" className="m3-muted">{aviso}</p>}
            <Button variant="ghost" size="sm" className="m3-auto" onClick={() => setBorrar(true)}>Borrar mis datos privados</Button>
          </section>
        </div>
      </div>

      <Dialog abierto={borrar} onCerrar={() => setBorrar(false)} titulo="¿Borrar tus datos privados?"
        descripcion="Se borran tus solicitudes de apoyo y tus datos de contacto seguro. No se puede deshacer."
        acciones={<><Button variant="ghost" onClick={() => setBorrar(false)}>Cancelar</Button><Button onClick={confirmarBorrado}>Sí, borrar</Button></>} />
    </AppTemplate>
  );
}
