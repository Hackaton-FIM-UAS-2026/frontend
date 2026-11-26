import { useState } from "react";
import { AppTemplate } from "../components/templates";
import { ApiEstado, Dialog } from "../components/molecules";
import { Button, ProgressBar } from "../components/atoms";
import { api } from "../services/api";
import { useApi } from "../services/useApi";
import "../modulos/caminos/estilos.css";

const ESTADO = { aplicado: "Aplicaste", guardado: "Guardaste para después", inscrita: "Te inscribiste", terminado: "Terminaste", contratada: "¡Te contrataron!" };

export default function Seguimiento() {
  const { datos: s, cargando, error, recargar } = useApi(api.seguimiento);
  const [borrar, setBorrar] = useState(false);
  const [aviso, setAviso] = useState("");

  const confirmarBorrado = async () => {
    try { await api.borrarSensible(); setAviso("Listo. Borramos tus datos privados."); }
    catch { setAviso("No pudimos borrarlos ahora. Intenta más tarde."); }
    setBorrar(false);
  };

  if (!s) return <AppTemplate><ApiEstado cargando={cargando} error={error} reintentar={recargar} /></AppTemplate>;
  const hechos = [
    ...s.recursos.map((r) => ({ texto: `${ESTADO[r.estado] || r.estado}: ${r.titulo}`, fecha: r.fecha })),
    ...s.historial.map((h) => ({ texto: h.texto, fecha: h.fecha })),
  ];

  return (
    <AppTemplate>
      <h1 className="m3-h1">Mi avance</h1>
      <div className="m3-col">
        <section className="card" aria-labelledby="hecho-t">
          <h2 id="hecho-t" className="m3-h2">Lo que has hecho</h2>
          {hechos.length
            ? <ul className="m3-linea">{hechos.map((h, i) => <li key={i}>{h.texto}<small>{h.fecha}</small></li>)}</ul>
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
