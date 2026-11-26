import { NavLink } from "react-router-dom";
import { Logo, Franja } from "../atoms";

export function AppHeader() {
  return (
    <header className="appheader">
      <Logo light />
      <Franja alto={6} />
    </header>
  );
}

export function BottomNav() {
  const items = [["/dashboard", "Recursos"], ["/seguimiento", "Mi avance"], ["/chat", "Asistente"]];
  return (
    <nav className="bottomnav" aria-label="Principal">
      {items.map(([to, label]) => (
        <NavLink key={to} to={to} className={({ isActive }) => (isActive ? "bn bn--on" : "bn")}>{label}</NavLink>
      ))}
    </nav>
  );
}
