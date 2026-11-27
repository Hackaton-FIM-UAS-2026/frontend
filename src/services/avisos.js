import { useSyncExternalStore } from "react";

// Aviso breve global ("Curso agregado"): sobrevive al cambio de pantalla.
let actual = null;
const oyentes = new Set();
const emitir = () => oyentes.forEach((f) => f());

export const avisar = (mensaje) => { actual = mensaje; emitir(); };
export const cerrarAviso = () => { actual = null; emitir(); };
export const useAviso = () => useSyncExternalStore((f) => { oyentes.add(f); return () => oyentes.delete(f); }, () => actual);
