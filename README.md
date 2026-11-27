# Empoderate · frontend

Plataforma para las mujeres de Ahome, Sinaloa, hecha con la **Secretaría de las Mujeres de Ahome (SEMujeres)**
para el **2do Hackathon FIM-UAS 2026**.

Responde un test de 12 preguntas y la plataforma te arma **caminos**: trabajos, cursos, becas y apoyos que de
verdad te quedan, con lo que ya tienes y lo que te falta para lograrlos. Si lo necesitas, te canaliza en
discreción con apoyo jurídico o psicológico de SEMujeres.

- **Demo en vivo:** https://empoderate-umber.vercel.app
- **Backend (API):** https://github.com/Hackaton-FIM-UAS-2026/backend — ver su `README.md`
- **Eje principal:** 2. Autonomía económica, empleabilidad y emprendimiento. También toca el eje 1
  (canalización discreta y directorio de emergencia sin conexión) y el eje 3 (expediente único y panel del personal).

> **Datos sintéticos:** todas las usuarias, empresas y recursos de la demo son ficticios
> (`backend/data/demo.json`, `backend/data/catalogo.json`), como pide la convocatoria.

## Qué puede hacer cada quien

| Quién | Qué hace | Dónde |
|---|---|---|
| Usuaria | Se registra (correo o Google), contesta el test, ve sus caminos y aplica o guarda opciones | `/registro`, `/test`, `/inicio`, `/explorar`, `/recurso/:id` |
| Usuaria | Sigue su avance y borra sus datos privados cuando quiera | `/seguimiento` |
| Usuaria | Platica con el asistente (texto o voz) y pide apoyo jurídico o psicológico | `/asistente` |
| Usuaria sin internet | Ve los números de emergencia (911 y línea de SEMujeres) | automático, `public/emergencia.html` |
| Personal de SEMujeres | Expediente único, canalizaciones, notas cifradas, visitas y revisión de empresas | `/admin/*` |
| Empresas | Registran vacantes; una persona de SEMujeres las revisa antes de publicarlas | `/empresas`, `/empresa` |

## Privacidad por diseño

- **Lo sensible va aparte y cifrado.** Las solicitudes de apoyo se guardan en una tabla separada, cifrada,
  y solo las ve el área que atiende. Cada lectura queda registrada en una bitácora.
- **Seguridad en la base de datos, no en los botones.** RLS de Supabase por rol; el navegador nunca escribe directo en las tablas.
- **Salida rápida** siempre visible (también con `Esc`): cambia la pantalla por una del clima y borra la conversación guardada.
- **La conversación no se guarda en el servidor.** Solo se recuerda en la pestaña del navegador
  hasta cerrar sesión o usar «Salida rápida».
- **La empresa ve lo mínimo:** nombre, teléfono, escolaridad, habilidades y experiencia. Nunca la CURP, la colonia
  ni nada de su atención en SEMujeres.
- **Consentimiento explícito** (se guarda la fecha en que aceptó por primera vez) y
  [aviso de privacidad](https://empoderate-umber.vercel.app/privacidad) en lenguaje claro.

## Accesibilidad

Lenguaje claro de tú y frases cortas. Dictado por voz en el asistente. Navegación con teclado y lectores de
pantalla (ARIA). Respeta «reducir movimiento». Pensada para celular con pocos datos, y sin conexión muestra los
números de emergencia.

## Tecnología

React 18 + Vite, React Router, `motion` para animaciones y Supabase Auth (correo y Google).
Los datos se piden a la API en FastAPI (`src/services/api.js`), nunca directo a las tablas.

```
src/
  modulos/        ← una carpeta por módulo, con sus rutas
    entrada/        registro, inicio de sesión, Google, nombre
    caminos/        inicio con caminos, explorar, completar perfil
    asistente/      chat con IA, dictado por voz, canalización
    expediente/     expediente único para el personal
    recepcion/      visitas programadas
    empresas/       registro de empresas y vacantes con revisión
    portada/        sitio público y aviso de privacidad
  pages/          ← test, detalle de recurso, mi avance, panel admin
  components/     ← átomos, moléculas, organismos y plantillas
  data/campos.js  ← copia del diccionario de campos (la oficial está en el backend)
  services/       ← cliente de la API, avisos, sesión
public/sw.js      ← service worker: sin conexión muestra public/emergencia.html
```

## Correr en local

Requisitos: Node 20+ y el backend corriendo (ver su README).

```bash
npm ci
# .env.local
VITE_SUPABASE_URL=https://<tu-proyecto>.supabase.co
VITE_SUPABASE_ANON_KEY=<publishable/anon key>
VITE_API_URL=http://localhost:8000
npm run dev
```

`npm run build` genera `dist/`. El despliegue es en Vercel (`vercel.json`).

## Documentos

- `PRODUCT.md`: para quién es, tono y restricciones.
- `DESIGN.md` y `PALETA.md`: sistema de diseño.
- `docs/diseno/`: maquetas por módulo.
