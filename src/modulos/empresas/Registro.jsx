import { useState } from "react";
import { Link } from "react-router-dom";
import { Button, Input, Logo } from "../../components/atoms";
import { supabase } from "../../lib/supabase";
import { subirArchivo } from "../../services/api";
import { registrar } from "./servicio.js";
import { Estado } from "./comun.jsx";
import "./estilos.css";

const RFC = /^[A-Za-zÑñ&]{3,4}\d{6}[A-Za-z0-9]{3}$/;
const VACIO = { nombre: "", rfc: "", giro: "", contacto_nombre: "", telefono: "", correo: "", pass: "" };

/** Registro público de empresas: cuenta + datos. Queda «En revisión» hasta que SEMujeres la apruebe. */
export default function Registro() {
  const [d, setD] = useState(VACIO);
  const [logo, setLogo] = useState(null);
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [listo, setListo] = useState(false);
  const campo = (k) => ({ value: d[k], onChange: (e) => setD({ ...d, [k]: e.target.value }) });

  const enviar = async (e) => {
    e.preventDefault();
    setError("");
    if (Object.entries(d).some(([, v]) => !v.trim())) return setError("Llena todos los campos.");
    if (!RFC.test(d.rfc.trim())) return setError("Revisa el RFC (12 o 13 caracteres).");
    if (d.pass.length < 6) return setError("La contraseña debe tener al menos 6 caracteres.");
    setEnviando(true);
    try {
      let { data, error: err } = await supabase.auth.signUp({ email: d.correo.trim(), password: d.pass,
        options: { data: { es_empresa: true, nombre: d.nombre.trim() } } });
      if (err && /registered|exists/i.test(err.message)) {
        ({ data, error: err } = await supabase.auth.signInWithPassword({ email: d.correo.trim(), password: d.pass }));
      }
      if (err) throw new Error("No pudimos crear la cuenta. Revisa el correo y la contraseña.");
      if (!data.session) throw new Error("Te mandamos un correo para confirmar la cuenta. Ábrelo y vuelve aquí.");
      const logo_url = logo ? await subirArchivo("logos", logo) : null;
      await registrar({ nombre: d.nombre.trim(), rfc: d.rfc.trim().toUpperCase(), giro: d.giro.trim(),
        contacto_nombre: d.contacto_nombre.trim(), telefono: d.telefono.trim(), logo_url });
      setListo(true);
    } catch (err2) {
      setError(err2.status === 409 ? "Esta cuenta ya tiene una empresa registrada. Entra a tu panel." : err2.message);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="m6-reg">
      <aside className="m6-reg__marca">
        <Link to="/" aria-label="Empoderate, inicio"><Logo light /></Link>
        <div>
          <p className="m6-reg__titulo">Abre tus puertas a mujeres de Ahome</p>
          <p className="m6-reg__texto">Publica tus vacantes. SEMujeres revisa cada una para que las candidatas lleguen con confianza.</p>
        </div>
        <p className="m6-reg__texto">Un programa de la Secretaría de las Mujeres de Ahome</p>
      </aside>
      <main id="contenido" className="m6-reg__lado">
        <header className="m6-reg__barra"><Link to="/" aria-label="Empoderate, inicio"><Logo /></Link></header>
        {listo ? (
          <div className="m6-reg__form">
            <p className="m6-ok" role="status"><b>Recibimos tu registro.</b> Una persona de SEMujeres lo revisará y verás el resultado en tu panel.</p>
            <Estado valor="pendiente" empresa />
            <p className="m6-muted">Mientras tanto puedes preparar tus vacantes; se publicarán cuando se aprueben tu empresa y cada vacante.</p>
            <Button to="/empresa">Ir a mi panel</Button>
          </div>
        ) : (
          <form className="m6-reg__form" onSubmit={enviar} noValidate>
            <h1 className="m6-h1">Registra tu empresa</h1>
            <p className="m6-muted">Es gratis. ¿Ya tienes cuenta? <Link to="/empresa">Entra a tu panel</Link>.</p>
            <Input label="Nombre de la empresa" {...campo("nombre")} />
            <div className="m6-dos">
              <Input label="RFC" maxLength={13} {...campo("rfc")} />
              <Input label="Giro" placeholder="Cafetería, restaurante…" {...campo("giro")} />
            </div>
            <div className="m6-dos">
              <Input label="Persona de contacto" {...campo("contacto_nombre")} />
              <Input label="Teléfono" type="tel" {...campo("telefono")} />
            </div>
            <div className="m6-dos">
              <Input label="Correo para entrar" type="email" autoComplete="email" {...campo("correo")} />
              <Input label="Contraseña" type="password" autoComplete="new-password" {...campo("pass")} />
            </div>
            <Input label="Logo (opcional)" type="file" accept="image/png,image/jpeg,image/svg+xml"
              onChange={(e) => setLogo(e.target.files?.[0] || null)} hint="PNG o JPG. Aparecerá en la página de empresas aliadas." />
            {error && <p className="m6-error" role="alert">{error}</p>}
            <Button block type="submit" loading={enviando}>Enviar registro</Button>
          </form>
        )}
      </main>
    </div>
  );
}
