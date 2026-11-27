import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { Button, Icon, Input } from "../atoms";
import { EmergencyBanner, OptionButton } from "../molecules";
import { borrarChat } from "../../lib/supabase";

const PASOS = 3;
const variantes = {
  entra: (dir) => ({ opacity: 0, transform: `translateX(${dir * 20}px)` }),
  quieta: { opacity: 1, transform: "translateX(0px)" },
  sale: (dir) => ({ opacity: 0, transform: `translateX(${dir * -12}px)`, transition: { duration: 0.14 } }),
};

/** Canalización sensible: consentimiento expreso, contacto seguro, salida rápida. Nada se guarda sin confirmar. */
export function SensitiveFlow({ onDone }) {
  const [paso, setPaso] = useState(0);
  const [dir, setDir] = useState(1);
  const [tipo, setTipo] = useState("");
  const [contacto, setContacto] = useState({ medio: "", horario: "", mensaje: "" });
  const [acepta, setAcepta] = useState(false);
  const salidaRapida = () => { borrarChat(); window.location.replace("https://www.google.com/search?q=clima"); };
  const ir = (n) => { setDir(n > paso ? 1 : -1); setPaso(n); };

  // Salida rápida también con la tecla Esc
  useEffect(() => {
    const esc = (e) => e.key === "Escape" && salidaRapida();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, []);

  return (
    <div className="sensible">
      {/* Portal: fuera de cualquier ancestro con transform, siempre fijo a la ventana */}
      {createPortal(
        <button type="button" className="salida" onClick={salidaRapida}>
          <Icon name="x" size={18} strokeWidth="2.4" /> Salir rápido <kbd>Esc</kbd>
        </button>,
        document.body
      )}

      <div className="sensible__top">
        <p className="sensible__paso">Paso {paso + 1} de {PASOS}</p>
        <div className="sensible__dots" aria-hidden="true">
          {Array.from({ length: PASOS }, (_, i) => <span key={i} className={i <= paso ? "on" : ""} />)}
        </div>
      </div>

      <div className="card sensible__card">
        <AnimatePresence mode="popLayout" initial={false} custom={dir}>
          <motion.div key={paso} custom={dir} variants={variantes} initial="entra" animate="quieta" exit="sale"
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }} className="sensible__step">
            {paso === 0 && (
              <>
                <h1>¿Qué tipo de apoyo necesitas?</h1>
                <div className="opts" role="radiogroup" aria-label="Tipo de apoyo">
                  {["Orientación jurídica", "Apoyo psicológico", "Ambas"].map((t) => (
                    <OptionButton key={t} label={t} role="radio" active={tipo === t} onClick={() => setTipo(t)} />
                  ))}
                </div>
                <Button block disabled={!tipo} onClick={() => ir(1)}>Continuar</Button>
              </>
            )}
            {paso === 1 && (
              <>
                <h1>¿Cómo es seguro contactarte?</h1>
                <Input as="select" label="Medio" value={contacto.medio} onChange={(e) => setContacto({ ...contacto, medio: e.target.value })}>
                  <option value="">Elige uno</option><option>Llamada</option><option>Mensaje de texto</option><option>Solo dentro de la app</option>
                </Input>
                <Input label="Mejor horario" hint="Por ejemplo: entre semana por la mañana." value={contacto.horario}
                  onChange={(e) => setContacto({ ...contacto, horario: e.target.value })} />
                <label className="check-row"><input type="checkbox" checked={contacto.mensaje === "si"}
                  onChange={(e) => setContacto({ ...contacto, mensaje: e.target.checked ? "si" : "" })} /> Se puede dejar mensaje</label>
                <div className="sensible__nav">
                  <Button variant="link" onClick={() => ir(0)}><Icon name="izq" size={18} /> Regresar</Button>
                  <Button disabled={!contacto.medio} onClick={() => ir(2)}>Continuar</Button>
                </div>
              </>
            )}
            {paso === 2 && (
              <>
                <h1>Tu consentimiento</h1>
                <p>Vamos a guardar solo: tipo de apoyo, tu forma segura de contacto y un resumen que tú apruebas.
                   No guardamos tu conversación. Puedes borrar todo desde la app cuando quieras.</p>
                <label className="check-row"><input type="checkbox" checked={acepta} onChange={(e) => setAcepta(e.target.checked)} />
                  Acepto el <a href="/privacidad" target="_blank" rel="noopener">aviso de privacidad</a> para datos sensibles y que me contacte una especialista de SEMujeres.</label>
                <Button block disabled={!acepta} onClick={() => onDone({ tipo, contacto })}>Enviar mi solicitud</Button>
                <Button block variant="ghost" onClick={() => onDone(null)}>No, gracias</Button>
                <Button variant="link" onClick={() => ir(1)}><Icon name="izq" size={18} /> Regresar</Button>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <EmergencyBanner />
    </div>
  );
}
