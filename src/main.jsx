import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { MotionConfig } from "motion/react";
import App from "./App.jsx";
import "./styles/tokens.css";
import "./styles/global.css";
import "./components/atoms/atoms.css";
import "./components/molecules/molecules.css";
import "./components/organisms/organisms.css";
import "./components/templates/templates.css";
import "./styles/home.css";
import "./styles/quiz.css";
import "./styles/admin.css";
import "./styles/responsive.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      {/* Respeta prefers-reduced-motion: quita desplazamientos y deja la opacidad */}
      <MotionConfig reducedMotion="user">
        <App />
      </MotionConfig>
    </BrowserRouter>
  </React.StrictMode>
);
