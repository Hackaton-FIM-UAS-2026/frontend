import Registro from "./Registro.jsx";
import PanelEmpresa from "./PanelEmpresa.jsx";

export const rutas = [
  { path: "/empresas/registro", element: <Registro /> },
  { path: "/empresa/*", element: <PanelEmpresa /> },
];
