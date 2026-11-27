import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Icon } from "../atoms";
import { Dialog } from "./Dialog.jsx";
import { MisDatos } from "./MisDatos.jsx";
import { salir } from "../../lib/supabase";
import { AvisoPrivacidadContenido } from "../../modulos/portada/Paginas.jsx";

/** Menú ☰ de la usuaria: mis datos y aviso de privacidad en ventanas, borrar datos y cerrar sesión. */
export function MenuCuenta() {
  const [vista, setVista] = useState(null); // null | "menu" | "datos" | "aviso"
  const nav = useNavigate();
  // Al pasar del menú a otra ventana, el <dialog> del menú dispara «close»: solo cierra si sigue siendo la vista actual
  const cerrarSi = (v) => () => setVista((actual) => (actual === v ? null : actual));
  const cerrar = () => setVista(null);
  const cerrarSesion = async () => {
    cerrar();
    try { await salir(); } finally { nav("/"); }
  };
  return (
    <>
      <button type="button" className="menucuenta__btn" onClick={() => setVista("menu")} aria-label="Abrir menú">
        <Icon name="menu" size={22} />
      </button>
      <Dialog abierto={vista === "menu"} onCerrar={cerrarSi("menu")} titulo="Menú">
        <div className="menucuenta">
          <button type="button" className="opt" onClick={() => setVista("datos")}>Mis datos</button>
          <button type="button" className="opt" onClick={() => setVista("aviso")}>Aviso de privacidad</button>
          <button type="button" className="opt" onClick={() => { cerrar(); nav("/seguimiento#mis-datos"); }}>Borrar mis datos</button>
          <Button block variant="ghost" onClick={cerrarSesion}><Icon name="salir" size={20} /> Cerrar sesión</Button>
        </div>
      </Dialog>
      <Dialog abierto={vista === "datos"} onCerrar={cerrarSi("datos")} titulo="Mis datos" descripcion="Completa lo que falte. Tu CURP es la llave de tu expediente en SEMujeres.">
        {vista === "datos" && <MisDatos />}
      </Dialog>
      <Dialog abierto={vista === "aviso"} onCerrar={cerrarSi("aviso")} titulo="Aviso de privacidad" ancho>
        {vista === "aviso" && <AvisoPrivacidadContenido />}
      </Dialog>
    </>
  );
}
