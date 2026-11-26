import { useEffect, useId, useRef } from "react";
import { Icon } from "../atoms";

/**
 * Diálogo modal sobre <dialog> nativo: foco atrapado, Esc y clic fuera cierran.
 * En móvil se presenta como hoja inferior. Con `onSubmit` el contenido es un <form>.
 */
export function Dialog({ abierto, onCerrar, titulo, descripcion, children, acciones, onSubmit, ancho }) {
  const ref = useRef(null);
  const tid = useId();

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (abierto && !d.open) d.showModal();
    if (!abierto && d.open) d.close();
  }, [abierto]);

  const Cuerpo = onSubmit ? "form" : "div";
  return (
    <dialog ref={ref} className={`dialog ${ancho ? "dialog--wide" : ""}`} aria-labelledby={tid}
      onClose={onCerrar}
      onClick={(e) => { if (e.target === ref.current) onCerrar(); }}>
      <Cuerpo className="dialog__frame" noValidate={onSubmit ? true : undefined}
        onSubmit={onSubmit ? (e) => { e.preventDefault(); onSubmit(e); } : undefined}>
        <header className="dialog__head">
          <div>
            <h2 id={tid}>{titulo}</h2>
            {descripcion && <p className="dialog__desc">{descripcion}</p>}
          </div>
          <button type="button" className="dialog__close" onClick={onCerrar} aria-label="Cerrar"><Icon name="x" size={22} /></button>
        </header>
        <div className="dialog__body">{children}</div>
        {acciones && <footer className="dialog__foot">{acciones}</footer>}
      </Cuerpo>
    </dialog>
  );
}
