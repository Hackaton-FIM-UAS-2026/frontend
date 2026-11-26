import { SiteHeader, SiteFooter } from "../organisms";

export function HomeTemplate({ children }) {
  return (
    <div className="home">
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
    </div>
  );
}
