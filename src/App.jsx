import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Registro from "./pages/Registro";
import TestBase from "./pages/TestBase";
import Resultado from "./pages/Resultado";
import Dashboard from "./pages/Dashboard";
import RecursoDetalle from "./pages/RecursoDetalle";
import Seguimiento from "./pages/Seguimiento";
import Chat from "./pages/Chat";
import Apoyo from "./pages/Apoyo";
import AdminPanel from "./pages/AdminPanel";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/registro" element={<Registro />} />
      <Route path="/test" element={<TestBase />} />
      <Route path="/resultado" element={<Resultado />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/recurso/:id" element={<RecursoDetalle />} />
      <Route path="/seguimiento" element={<Seguimiento />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="/apoyo" element={<Apoyo />} />
      <Route path="/admin/*" element={<AdminPanel />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
