import { AppHeader, BottomNav } from "../organisms";

export function AppTemplate({ children }) {
  return (
    <div className="app">
      <AppHeader />
      <main className="app__main">{children}</main>
      <BottomNav />
    </div>
  );
}

export function AuthTemplate({ children }) {
  return (
    <div className="auth">
      <div className="auth__card">{children}</div>
    </div>
  );
}

export function FocusTemplate({ children }) {
  return <div className="focus"><main className="app__main">{children}</main></div>;
}
