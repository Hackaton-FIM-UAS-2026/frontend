import { Navigate } from "react-router-dom";
import IniciarSesion from "./IniciarSesion.jsx";
import CrearCuenta from "./CrearCuenta.jsx";
import Listo from "./Listo.jsx";

export const rutas = [
  { path: "/entrar", element: <IniciarSesion /> },
  { path: "/registro", element: <CrearCuenta /> },
  { path: "/entrar/listo", element: <Listo /> },
  { path: "/entrar/correo", element: <Navigate to="/entrar" replace /> },
];
