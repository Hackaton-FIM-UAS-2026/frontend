import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { QuizTemplate } from "../components/templates";
import { QuizAside, TestBaseWizard } from "../components/organisms";
import { TEST_BASE } from "../data/campos";
import { guardarCampos } from "../services/expediente";

export default function TestBase() {
  const nav = useNavigate();
  const [indice, setIndice] = useState(0);
  const [resp, setResp] = useState({});

  const cambiar = (campo, valor) => setResp((r) => ({ ...r, [campo]: valor }));
  const siguiente = () => {
    if (indice + 1 < TEST_BASE.length) setIndice(indice + 1);
    else { guardarCampos(resp, "test_base"); nav("/resultado"); }
  };

  return (
    <QuizTemplate aside={<QuizAside indice={indice} />}>
      <TestBaseWizard indice={indice} respuestas={resp} onChange={cambiar} onNext={siguiente} onBack={() => setIndice(indice - 1)} />
    </QuizTemplate>
  );
}
