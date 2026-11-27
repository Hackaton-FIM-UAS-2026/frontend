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
      const sugerido = m.given_name || (m.full_name || m.name || "").split(" ")[0];
      if (sugerido) setNombre((n) => n || sugerido);
    });
  }, []);

  const seguir = async (e) => {
    e.preventDefault();
    if (!nombre.trim()) return setError("Escribe tu nombre.");
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
        <h1 className="m1-titulo">¿Cómo te llamas?</h1>
        <p className="m1-lead">Así te saludamos en la app. Puedes escribir solo tu nombre.</p>
        <Input id="nombre" label="Tu nombre" autoComplete="given-name" maxLength={120} value={nombre}
          onChange={(e) => setNombre(e.target.value)} />
        {error && <p className="m1-error" role="alert">{error}</p>}
        <Button block type="submit" loading={enviando}>Continuar</Button>
      </form>
    </EntradaLayout>
  );
}
