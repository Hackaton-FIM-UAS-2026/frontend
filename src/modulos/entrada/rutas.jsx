import Entrar from "./Entrar.jsx";
import EntrarCorreo from "./EntrarCorreo.jsx";
import Listo from "./Listo.jsx";

export const rutas = [
  { path: "/entrar", element: <Entrar /> },
  { path: "/entrar/correo", element: <EntrarCorreo /> },
  { path: "/entrar/listo", element: <Listo /> },
];
