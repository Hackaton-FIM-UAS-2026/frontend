import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Icon } from "../atoms";
import { Dialog } from "./Dialog.jsx";
import { salir } from "../../lib/supabase";

/** Menú ☰ de la usuaria: aviso de privacidad, borrar datos y cerrar sesión (celulares compartidos). */
export function MenuCuenta() {
  const [abierto, setAbierto] = useState(false);
  const nav = useNavigate();
  const ir = (ruta) => { setAbierto(false); nav(ruta); };
  const cerrarSesion = async () => {
    setAbierto(false);
    try { await salir(); } finally { nav("/"); }
  };
  return (
    <>
      <button type="button" className="menucuenta__btn" onClick={() => setAbierto(true)} aria-label="Abrir menú">
        <Icon name="menu" size={22} />
      </button>
      <Dialog abierto={abierto} onCerrar={() => setAbierto(false)} titulo="Menú">
        <div className="menucuenta">
          <button type="button" className="opt" onClick={() => ir("/seguimiento")}>Mis datos</button>
          <button type="button" className="opt" onClick={() => ir("/privacidad")}>Aviso de privacidad</button>
          <button type="button" className="opt" onClick={() => ir("/seguimiento#mis-datos")}>Borrar mis datos</button>
          <Button block variant="ghost" onClick={cerrarSesion}><Icon name="salir" size={20} /> Cerrar sesión</Button>
        </div>
      </Dialog>
    </>
  );
}
