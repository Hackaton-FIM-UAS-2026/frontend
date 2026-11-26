import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Icon } from "../../components/atoms";
import { CIFRAS, LINEA, RESPALDO_ALIADAS } from "./datos.js";
import { empresasAliadas } from "./servicio.js";
import "./estilos.css";

export const comenzar = () => "/registro";

export function Seccion({ id, alt, marca, titulo, lead, children, className = "" }) {
  return (
    <section id={id} className={`m7-sec ${alt ? "m7-sec--alt" : ""} ${marca ? "m7-sec--marca" : ""} ${className}`}>
      <div className="container">
        {titulo && <h2 className="m7-titulo">{titulo}</h2>}
        {lead && <p className="m7-lead">{lead}</p>}
        {children}
      </div>
    </section>
  );
}

export function Cifras() {
  return (
    <div className="m7-cifras">
      {CIFRAS.map(([n, t]) => <div key={t} className="m7-cifra"><b>{n}</b><span>{t}</span></div>)}
    </div>
  );
}

export function Pilar({ icono, titulo, children }) {
  return (
    <div className="m7-pilar">
      <span className="m7-pilar__ic"><Icon name={icono} size={22} /></span>
      <h3>{titulo}</h3>
      <p>{children}</p>
    </div>
  );
}

export const POR_QUE = [
  ["buscar", "La información está dispersa", "Cursos, vacantes y becas viven en muchos lugares distintos."],
  ["reloj", "El tiempo no alcanza", "Trabajo, hijos y cuidados dejan poco espacio para buscar."],
  ["usuaria", "Contar tu historia otra vez", "Pedir ayuda no debería significar repetirlo todo a cada persona."],
];
export const QUE_HACEMOS = [
  ["ruta", "Te orientamos", "Te mostramos el trabajo, curso, beca o apoyo que te queda, y qué te falta para lograrlo."],
  ["maletin", "Te conectamos con empresas", "Vacantes de empresas de Ahome, revisadas una por una por SEMujeres."],
  ["corazon", "Te acompañamos", "Si necesitas asesoría legal o psicológica, SEMujeres te atiende sin que repitas tu historia."],
];
export const VIDA_REAL = [
  ["reloj", "Tu tiempo y tus cuidados", "Buscamos opciones que te cuadren con tus horarios y con quien cuidas."],
  ["wifi", "Pocos datos", "Ligera, sin videos automáticos."],
  ["chat", "Fácil de entender", "Frases cortas, sin palabras complicadas."],
  ["candado", "Tus datos, contigo", "Nada se guarda sin tu permiso."],
];

/** Diagrama de bolitas y palitos: 4 pasos y una rama final. Horizontal en escritorio, vertical en celular. */
export function Flujo({ detalle }) {
  const pasos = [
    ["celular", "Entras", detalle ? "Con tu cuenta de Google o con tu correo." : "Con Google o con tu correo."],
    ["lapiz", "Nos cuentas de ti", detalle ? "12 preguntas de opción múltiple. Cada una dice para qué la usamos." : "12 preguntas, menos de 3 minutos."],
    ["ruta", "Ves tus caminos", "Lo que te conviene y qué te falta."],
    ["chat", "Te acompañamos", "Nuestro asistente resuelve tus dudas."],
  ];
  return (
    <ol className="m7-flujo">
      {pasos.map(([ic, t, d], i) => (
        <li key={t} className="m7-flujo__paso">
          <span className={`m7-bolita ${i === 3 ? "m7-bolita--fuerte" : ""}`} aria-hidden="true"><Icon name={ic} size={26} /></span>
          <div><b>{detalle ? `${i + 1} · ${t}` : t}</b><small>{d}</small></div>
        </li>
      ))}
      <li className="m7-flujo__rama">
        <div><span className="m7-bolita m7-bolita--sm" aria-hidden="true"><Icon name="check" size={20} /></span>
          <span><b>Das el paso</b><small>Aplicas, te inscribes o pides el apoyo.</small></span></div>
        <div><span className="m7-bolita m7-bolita--sm" aria-hidden="true"><Icon name="escudo" size={20} /></span>
          <span><b>SEMujeres te atiende</b><small>Solo si lo necesitas y tú lo pides.</small></span></div>
      </li>
    </ol>
  );
}

export function EmpresasAliadas() {
  const [lista, setLista] = useState(RESPALDO_ALIADAS);
  useEffect(() => { empresasAliadas().then((l) => l?.length && setLista(l)).catch(() => {}); }, []);
  return (
    <div className="m7-aliadas">
      {lista.map((e) => <img key={e.nombre} src={e.logo_url} alt={e.nombre} loading="lazy" />)}
      <span className="m7-hueco">Tu empresa aquí</span>
    </div>
  );
}

export function TarjetaPeligro() {
  return (
    <div className="card m7-peligro">
      <h3>¿Estás en peligro ahora?</h3>
      <p>Llama a la línea de atención de SEMujeres.</p>
      <Button block href={`tel:${LINEA.tel}`}><Icon name="telefono" size={20} /> {LINEA.telefono}</Button>
      <p className="m7-peq">Si no contestan: <a href="tel:911">911</a></p>
    </div>
  );
}

export function SigueCon({ to, children }) {
  return (
    <div className="m7-sigue">
      <span>Sigue con:</span>
      <Link to={to} className="btn btn--ghost">{children} <Icon name="flecha" size={18} /></Link>
    </div>
  );
}
