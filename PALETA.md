# Paleta de colores — Camino

Extraída de los carteles de referencia (Conferencia Regional sobre la Mujer, Mujeres en la Pesca, Compromiso Nacional, Mujeres Quintana Roo). Los valores son aproximaciones tomadas a ojo de las imágenes; ajusta con el cuentagotas si tienes los archivos originales.

| Rol | Token | Hex | De dónde sale |
|---|---|---|---|
| Primario | `--morado-700` | #5b2c83 | Colibrí, tarjeta Q. Roo |
| Primario oscuro | `--morado-900` | #3e1b5c | Fondo del degradado |
| Primario claro | `--morado-100` | #ebddf5 | Fondos suaves |
| Secundario | `--guinda-700` | #5e1236 | Botón "Continuar leyendo" |
| Acento | `--coral-500` | #e8603c | "por la vida, la felicidad" |
| Naranja | `--naranja-500` | #ec8216 | Arco del banner |
| Mostaza | `--mostaza-500` | #d9a514 | Espiral del colibrí |
| Turquesa | `--turquesa-500` | #14a3b5 | Arco superior |
| Oliva | `--oliva-500` | #6f8460 | Arco inferior |
| Magenta | `--magenta-500` | #a9489b | Estrella de Pesca |
| Fondo | `--crema-50` | #fbf7ef | Fondo crema de los carteles |

**Rutas:** Empleabilidad = turquesa · Emprendimiento = naranja · Capacitación = magenta.
**Zona sensible:** solo morados, sin rojos de alerta (más sobria y discreta).
**Contraste:** texto blanco sobre morado-700/900 y guinda cumple AA; sobre naranja, mostaza y turquesa usa texto oscuro (`--tinta`).

## Estructura (Atomic Design)

```
src/
  styles/tokens.css          ← paleta y variables
  components/
    atoms/        Button, Badge, Input, ProgressBar, Franja, Check, Logo
    molecules/    QuestionCard, RequirementItem, ResourceCard, RouteSummary, ChatBubble, EmergencyBanner, StatCard
    organisms/    TestBaseWizard, ResourceDashboard, ResourceDetail, AgentChat, SensitiveFlow, Navigation, AdminOrganisms
    templates/    AppTemplate, AuthTemplate, FocusTemplate, AdminTemplate
  pages/          Registro, TestBase, Resultado, Dashboard, RecursoDetalle, Seguimiento, Chat, Apoyo, AdminPanel
  services/       motorRuta (reglas del MD), expediente (fusión/versión)
  data/           campos (test base de 12 preguntas), recursos (catálogo de ejemplo)
```

## Cómo correr

```bash
npm install
npm run dev
```
