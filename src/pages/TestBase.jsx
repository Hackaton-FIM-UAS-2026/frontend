import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { QuizTemplate } from "../components/templates";
import { QuizAside, TestBaseWizard } from "../components/organisms";
import { TEST_BASE, conTextoOtro } from "../data/campos";
import { api, patch } from "../services/api";

export default function TestBase() {
  const nav = useNavigate();
  const [indice, setIndice] = useState(0);
  const [resp, setResp] = useState({});
  const [guardando, setGuardando] = useState(false);

  const cambiar = (campo, valor) => setResp((r) => ({ ...r, [campo]: valor }));
  const siguiente = async () => {
    if (indice + 1 < TEST_BASE.length) { setIndice(indice + 1); return; }
    if (guardando) return;
    setGuardando(true);
    try {
      // Solo las respuestas del test, más el texto de «Otro» si lo escribió
      const datos = {};
      for (const q of TEST_BASE) {
        if (resp[q.campo] === undefined) continue;
        Object.assign(datos, { [q.campo]: resp[q.campo] }, conTextoOtro(q, resp[q.campo], q.otro && resp[q.otro.campo]));
      }
      await api.guardarCampos(datos, "test_base");
      // CURP, RFC y dirección van a «Mis datos» (perfil), no al test
      const identidad = Object.fromEntries(["curp", "rfc", "direccion"].map((k) => [k, (resp[k] || "").trim()]).filter(([, v]) => v));
      if (Object.keys(identidad).length) {
        try { await patch("/me/datos", identidad); }
        catch (e) { alert(`${e.message} Puedes corregirlo después en Menú → Mis datos.`); }
      }
      nav("/resultado");
    } catch (e) {
      if (e.status === 401) nav("/registro");
      else alert(e.message || "No pudimos guardar tus respuestas. Intenta de nuevo.");
    } finally {
      setGuardando(false);
    }
  };

  return (
    <QuizTemplate aside={<QuizAside indice={indice} />}>
      <TestBaseWizard indice={indice} respuestas={resp} onChange={cambiar} onNext={siguiente} onBack={() => setIndice(indice - 1)} />
    </QuizTemplate>
  );
}
