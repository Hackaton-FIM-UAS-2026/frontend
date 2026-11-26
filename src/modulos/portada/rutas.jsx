import { ApoyoInfo, ComoFunciona, Empresas, QueHacemos, QuienesSomos } from "./Paginas.jsx";

export const rutas = [
  { path: "/quienes-somos", element: <QuienesSomos /> },
  { path: "/que-hacemos", element: <QueHacemos /> },
  { path: "/como-funciona", element: <ComoFunciona /> },
  { path: "/empresas", element: <Empresas /> },
  { path: "/apoyo", element: <ApoyoInfo /> },
];
