/**
 * Logo oficial de Empoderate (public/logo/). `light` = versión clara para fondos morados.
 * `grande` = paneles de marca (entrada, registro de empresas, pie de página).
 */
export function Logo({ light, grande }) {
  return (
    <img className={`logo ${grande ? "logo--grande" : ""}`}
      src={light ? "/logo/empoderate-claro.svg" : "/logo/empoderate.svg"}
      alt="Empoderate · Secretaría de las Mujeres · Ahome" width="1320" height="306" decoding="async" />
  );
}
