import { useEffect, useState } from "react";
import { Button, Input } from "../atoms";
import { get, patch } from "../../services/api";

const VACIO = { nombre: "", telefono: "", curp: "", rfc: "", direccion: "" };

/** Contenido del modal «Mis datos»: nombre, teléfono, CURP, RFC y dirección. La CURP no se cambia una vez guardada. */
export function MisDatos({ onListo }) {
  const [d, setD] = useState(VACIO);
  const [curpGuardada, setCurpGuardada] = useState(false);
  const [estado, setEstado] = useState({ cargando: true });
  useEffect(() => {
    get("/me/datos")
      .then((x) => { setD({ ...VACIO, ...Object.fromEntries(Object.entries(x).map(([k, v]) => [k, v || ""])) }); setCurpGuardada(Boolean(x.curp)); setEstado({}); })
      .catch((e) => setEstado({ error: e.message }));
  }, []);
  const campo = (k) => ({ value: d[k], onChange: (e) => setD({ ...d, [k]: k === "curp" || k === "rfc" ? e.target.value.toUpperCase() : e.target.value }) });

  const guardar = async (e) => {
    e.preventDefault();
    setEstado({ guardando: true });
    try {
      const cuerpo = Object.fromEntries(Object.entries(d).filter(([k, v]) => v.trim() && !(k === "curp" && curpGuardada)));
      const x = await patch("/me/datos", cuerpo);
      setCurpGuardada(Boolean(x.curp));
      setEstado({ ok: "Listo, guardamos tus datos." });
      onListo?.();
    } catch (err) {
      setEstado({ error: err.message });
    }
  };

  if (estado.cargando) return <p className="muted">Cargando…</p>;
  return (
    <form className="misdatos" onSubmit={guardar} noValidate>
      <Input label="Nombre completo" autoComplete="name" {...campo("nombre")} />
      <Input label="Teléfono" type="tel" inputMode="numeric" autoComplete="tel-national" hint="10 dígitos." {...campo("telefono")} />
      <Input label="CURP" maxLength={18} autoComplete="off" readOnly={curpGuardada}
        hint={curpGuardada ? "Ya está en tu expediente. Si hay un error, acude a SEMujeres." : "18 letras y números. Si no la sabes, búscala en gob.mx/curp."} {...campo("curp")} />
      <Input label="RFC (opcional)" maxLength={13} autoComplete="off" {...campo("rfc")} />
      <Input label="Dirección (opcional)" autoComplete="street-address" hint="Calle, número y colonia." {...campo("direccion")} />
      {estado.error && <p className="misdatos__error" role="alert">{estado.error}</p>}
      {estado.ok && <p className="misdatos__ok" role="status">{estado.ok}</p>}
      <Button block type="submit" loading={estado.guardando}>Guardar mis datos</Button>
    </form>
  );
}
