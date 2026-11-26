import { useEffect, useRef, useState } from "react";

/** Dictado por voz (Web Speech API, es-MX). Si el navegador no lo tiene, `disponible` es false. */
export function useDictado(onTexto) {
  const SR = typeof window !== "undefined" && (window.SpeechRecognition || window.webkitSpeechRecognition);
  const [escuchando, setEscuchando] = useState(false);
  const rec = useRef(null);
  const cb = useRef(onTexto);
  cb.current = onTexto;

  useEffect(() => () => rec.current?.abort?.(), []);

  const alternar = () => {
    if (!SR) return;
    if (escuchando) { rec.current?.stop(); return; }
    const r = new SR();
    r.lang = "es-MX";
    r.interimResults = false;
    r.maxAlternatives = 1;
    r.onresult = (e) => cb.current(e.results[0][0].transcript);
    r.onend = () => setEscuchando(false);
    r.onerror = () => setEscuchando(false);
    rec.current = r;
    setEscuchando(true);
    r.start();
  };
  return { disponible: Boolean(SR), escuchando, alternar };
}
