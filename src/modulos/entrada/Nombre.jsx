import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input } from "../../components/atoms";
import { supabase } from "../../lib/supabase";
import { EntradaLayout } from "./Layout.jsx";
import { adondeIr, recuperar } from "./sesion.js";

/** /entrar/nombre — la cuenta (p. ej. de Google) no tiene nombre: se lo pedimos antes de seguir. */
export default function Nombre() {
  const nav = useNavigate();
  const [nombre, setNombre] = useState("");
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  // Sugerimos el nombre que trae Google; ella lo confirma o lo cambia
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const m = data.session?.user?.user_metadata || {};
      const sugerido = m.full_name || m.name || [m.given_name, m.family_name].filter(Boolean).join(" ");
      if (sugerido) setNombre((n) => n || sugerido);
    });
  }, []);

  const seguir = async (e) => {
    e.preventDefault();
    if (nombre.trim().split(/\s+/).length < 2) return setError("Escribe tu nombre completo: nombre y apellidos.");
    setEnviando(true);
    try {
      nav(await adondeIr({ ...recuperar(), nombre: nombre.trim() }), { replace: true });
    } catch (err) {
      setError(err.message);
      setEnviando(false);
    }
  };

  return (
    <EntradaLayout>
      <form className="m1-pila" onSubmit={seguir} noValidate>
        <h1 className="m1-titulo">¿Cuál es tu nombre completo?</h1>
        <p className="m1-lead">Lo usamos para abrir tu expediente en SEMujeres. Escribe tu nombre y tus apellidos.</p>
        <Input id="nombre" label="Nombre completo" autoComplete="name" maxLength={120} value={nombre}
          onChange={(e) => setNombre(e.target.value)} />
        {error && <p className="m1-error" role="alert">{error}</p>}
        <Button block type="submit" loading={enviando}>Continuar</Button>
      </form>
    </EntradaLayout>
  );
}
