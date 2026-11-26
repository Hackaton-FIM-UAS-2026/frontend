import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { QuizTemplate } from "../components/templates";
import { QuizAside, TestBaseWizard } from "../components/organisms";
import { TEST_BASE } from "../data/campos";
import { api } from "../services/api";

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
      await api.guardarCampos(resp, "test_base");
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
