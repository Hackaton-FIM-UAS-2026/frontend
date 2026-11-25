const PATHS = {
  ruta: "M4 20c0-9 6-15 16-16 0 10-6 16-16 16z M4 20L14 10",
  libro: "M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z M4 19V5",
  maletin: "M3 8h18v11H3z M9 8V5h6v3",
  moneda: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z M12 7v10 M9.5 9.5c0-1.2 1-1.8 2.5-1.8s2.5.6 2.5 1.8-1 1.6-2.5 2-2.5.8-2.5 2 1 1.8 2.5 1.8 2.5-.6 2.5-1.8",
  corazon: "M12 20s-7-4.6-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.4-7 10-7 10z",
  reloj: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z M12 7v5l3 2",
  wifi: "M2 9a15 15 0 0 1 20 0 M5 12.5a10 10 0 0 1 14 0 M8.5 16a5 5 0 0 1 7 0 M12 19.5h.01",
  candado: "M5 11h14v9H5z M8 11V8a4 4 0 0 1 8 0v3",
  chat: "M4 5h16v11H9l-5 4z",
  usuaria: "M12 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8z M4 20c0-4 4-6 8-6s8 2 8 6",
  check: "M5 12l5 5L20 7",
  escudo: "M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z",
  beca: "M2 9l10-5 10 5-10 5z M6 11v5c0 1.5 3 3 6 3s6-1.5 6-3v-5",
  flecha: "M5 12h14 M13 6l6 6-6 6",
  panel: "M3 3h8v8H3z M13 3h8v5h-8z M13 10h8v11h-8z M3 13h8v8H3z",
  usuarias: "M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z M2 20c0-3.5 3-5.5 7-5.5s7 2 7 5.5 M17 4.5a3.5 3.5 0 0 1 0 6.5 M18 14.8c2.5.6 4 2.3 4 5.2",
  bandeja: "M3 13l3-8h12l3 8v6H3z M3 13h5l1 3h6l1-3h5",
  grafica: "M4 20V10 M10 20V4 M16 20v-8 M22 20H2",
  buscar: "M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14z M20 20l-4-4",
  calendario: "M4 6h16v14H4z M4 10h16 M8 3v4 M16 3v4",
  descargar: "M12 4v11 M7 11l5 5 5-5 M4 20h16",
  salir: "M10 4H4v16h6 M14 8l4 4-4 4 M18 12H9",
  menu: "M4 7h16 M4 12h16 M4 17h16",
  campana: "M6 17V11a6 6 0 0 1 12 0v6l2 2H4z M10 21h4",
  izq: "M15 5l-7 7 7 7",
  der: "M9 5l7 7-7 7",
  x: "M6 6l12 12 M18 6L6 18",
  alerta: "M12 3l9.5 17h-19z M12 10v4 M12 17.5h.01",
  enviar: "M4 12l16-8-6 16-2.5-6.5z M11.5 13.5L20 4",
  telefono: "M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a1 1 0 0 1-1 1A16 16 0 0 1 4 5a1 1 0 0 1 1-1z",
  ubicacion: "M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z M12 7.5a2 2 0 1 0 0 4 2 2 0 0 0 0-4z",
  casa: "M4 11l8-7 8 7 M6 9.5V20h12V9.5",
  avance: "M4 19h16 M7 15l4-4 3 3 5-6",
  texto: "M4 18L9 6l5 12 M5.8 14h6.4 M15 18l3-7 3 7 M15.9 16h4.2",
};

export function Icon({ name, size = 28, ...p }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...p}>
      <path d={PATHS[name] || PATHS.check} />
    </svg>
  );
}
