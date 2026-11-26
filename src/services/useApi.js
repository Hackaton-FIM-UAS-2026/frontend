// Hook mínimo para pasar de lecturas síncronas (localStorage) a la API.
//
//   const { datos, cargando, error, recargar } = useApi(api.recomendaciones);
//
import { useCallback, useEffect, useState } from "react";

export function useApi(fn, deps = []) {
  const [n, setN] = useState(0);
  const [estado, setEstado] = useState({ datos: null, cargando: true, error: null });
  useEffect(() => {
    let vivo = true;
    setEstado((e) => ({ ...e, cargando: true }));
    fn()
      .then((datos) => vivo && setEstado({ datos, cargando: false, error: null }))
      .catch((error) => vivo && setEstado({ datos: null, cargando: false, error }));
    return () => { vivo = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, n]);
  const recargar = useCallback(() => setN((x) => x + 1), []);
  return { ...estado, recargar };
}
