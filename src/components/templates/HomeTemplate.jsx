import { SiteHeader, SiteFooter } from "../organisms";
import { SkipLink } from "./Templates.jsx";

export function HomeTemplate({ children }) {
  return (
    <div className="home">
      <SkipLink />
      <SiteHeader />
      <main id="contenido">{children}</main>
      <SiteFooter />
    </div>
  );
}
