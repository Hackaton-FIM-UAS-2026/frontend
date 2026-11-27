import { useState } from "react";
import { AppTemplate } from "../components/templates";
import { ApiEstado, Dialog } from "../components/molecules";
import { Button, ProgressBar } from "../components/atoms";
import { api } from "../services/api";
import { useApi } from "../services/useApi";
import "../modulos/caminos/estilos.css";

const ESTADO = { aplicado: "Aplicaste", guardado: "Guardaste para después", inscrita: "Te inscribiste", terminado: "Terminaste", contratada: "¡Te contrataron!" };

const CATEGORIAS = [["todo", "Todo"], ["vacante", "Vacantes"], ["curso", "Cursos"], ["apoyo", "Becas y apoyos"], ["semujeres", "Apoyo de SEMujeres"], ["perfil", "Mi perfil"]];
const CAT_TIPO = { vacante: "vacante", curso: "curso", beca: "apoyo", apoyo: "apoyo", financiamiento: "apoyo" };
const ETQ = { vacante: ["Vacante", "vacante"], curso: ["Curso", "curso"], apoyo: ["Beca o apoyo", "apoyo"], semujeres: ["SEMujeres", "semujeres"], perfil: ["Perfil", "perfil"] };

export default function Seguimiento() {
  const { datos: s, cargando, error, recargar } = useApi(async () => {
    const [seg, canal] = await Promise.all([api.seguimiento(), api.misCanalizaciones().catch(() => [])]);
    return { ...seg, canalizaciones: canal };
  });
  const [cat, setCat] = useState("todo");
  const [borrar, setBorrar] = useState(false);
  const [aviso, setAviso] = useState("");

  const confirmarBorrado = async () => {
    try { await api.borrarSensible(); setAviso("Listo. Borramos tus datos privados."); }
    catch { setAviso("No pudimos borrarlos ahora. Intenta más tarde."); }
    setBorrar(false);
  };

  if (!s) return <AppTemplate><ApiEstado cargando={cargando} error={error} reintentar={recargar} /></AppTemplate>;
  const hechos = [
    ...s.canalizaciones.map((c) => ({ cat: "semujeres", texto: `Pediste apoyo a SEMujeres · ${c.departamento}`, detalle: `${c.estado_texto} · folio ${c.folio}`, fecha: c.fecha })),
    ...s.recursos.map((r) => ({ cat: CAT_TIPO[r.tipo] || "apoyo", texto: `${ESTADO[r.estado] || r.estado}: ${r.titulo}`, fecha: r.fecha })),
    // Lo que no es aplicar/guardar (test, datos que agregaste) va en «Mi perfil»
    ...s.historial.filter((h) => !/^(Aplicó|Guardó) /.test(h.texto)).map((h) => ({ cat: "perfil", texto: h.texto, fecha: h.fecha })),
  ];
  const conteo = Object.fromEntries(CATEGORIAS.map(([k]) => [k, k === "todo" ? hechos.length : hechos.filter((h) => h.cat === k).length]));
  const visibles = cat === "todo" ? hechos : hechos.filter((h) => h.cat === cat);

  return (
    <AppTemplate>
      <h1 className="m3-h1">Mi avance</h1>
      <div className="m3-col">
        <section className="card" aria-labelledby="hecho-t">
          <h2 id="hecho-t" className="m3-h2">Lo que has hecho</h2>
          {hechos.length > 0 && (
            <div className="m3-chips" role="tablist" aria-label="Filtrar por categoría">
              {CATEGORIAS.filter(([k]) => k === "todo" || conteo[k]).map(([k, t]) => (
                <button key={k} type="button" role="tab" aria-selected={cat === k} className={`m3-chip ${cat === k ? "m3-chip--on" : ""}`}
                  onClick={() => setCat(k)}>{t} {conteo[k]}</button>
              ))}
            </div>
          )}
          {visibles.length
            ? <ul className="m3-linea m3-avance">{visibles.map((h, i) => (
                <li key={i}>
                  <span className={`m3-tipo m3-tipo--${ETQ[h.cat][1]}`}>{ETQ[h.cat][0]}</span>
                  <span className="m3-avance__t">{h.texto}</span>
                  <small>{[h.detalle, h.fecha].filter(Boolean).join(" · ")}</small>
                </li>))}</ul>
            : <p className="m3-muted">Aquí verás lo que vayas haciendo: cursos, vacantes a las que apliques y más.</p>}
        </section>

        <section className="card" aria-labelledby="perfil-t">
          <h2 id="perfil-t" className="m3-h2">Tu perfil</h2>
          <p className="m3-muted">{s.datos_guardados} de {s.total} datos</p>
          <ProgressBar value={s.datos_guardados} max={s.total} label="Tu perfil" />
          <p className="m3-muted">Entre más nos cuentes, mejores opciones te damos.</p>
          {s.datos_guardados < s.total && <Button variant="quiet" size="sm" to="/completar-perfil?volver=/seguimiento" className="m3-auto">Completar mi perfil</Button>}
        </section>

        <section className="card card--sunken" aria-labelledby="datos-t" id="mis-datos">
          <h2 id="datos-t" className="m3-h2">Tus datos</h2>
          <p className="m3-muted">Tú decides qué guardamos. Puedes borrar tus datos privados cuando quieras.</p>
          {aviso && <p role="status" className="m3-muted">{aviso}</p>}
          <Button variant="ghost" size="sm" className="m3-auto" onClick={() => setBorrar(true)}>Borrar mis datos privados</Button>
        </section>
      </div>

      <Dialog abierto={borrar} onCerrar={() => setBorrar(false)} titulo="¿Borrar tus datos privados?"
        descripcion="Se borran tus solicitudes de apoyo y tus datos de contacto seguro. No se puede deshacer."
        acciones={<><Button variant="ghost" onClick={() => setBorrar(false)}>Cancelar</Button><Button onClick={confirmarBorrado}>Sí, borrar</Button></>} />
    </AppTemplate>
  );
}
