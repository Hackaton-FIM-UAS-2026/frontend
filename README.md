# Empoderate · frontend

Plataforma para las mujeres de Ahome, Sinaloa, hecha con la **Secretaría de las Mujeres de Ahome (SEMujeres)**
para el **2do Hackathon FIM-UAS 2026**.

Contestas un test corto y la plataforma te arma **caminos**: trabajos, cursos, becas y apoyos que de verdad te
quedan, con lo que ya tienes y lo que te falta para lograrlos. Si lo necesitas, te canaliza con discreción al
apoyo jurídico o psicológico de SEMujeres.

- **Demo en vivo:** https://empoderate-umber.vercel.app
- **Backend (API):** https://github.com/Hackaton-FIM-UAS-2026/backend
- **Eje principal:** 2. Autonomía económica, empleabilidad y emprendimiento. También toca el eje 1
  (canalización discreta y números de emergencia sin conexión) y el eje 3 (expediente único y panel del
  personal).

> **Datos sintéticos.** Todas las usuarias, empresas y recursos de la demo son ficticios
> (`backend/data/demo.json`, `backend/data/catalogo.json`), como pide la convocatoria.

## Qué puede hacer cada quien

**Usuarias**

- Crear su cuenta con correo o Google y contestar el test (`/registro`, `/test`).
- Ver sus caminos, explorar opciones y aplicar o guardar las que le interesan (`/inicio`, `/explorar`,
  `/recurso/:id`).
- Completar su perfil con una entrevista que solo pregunta lo que falta (`/completar-perfil`).
- Revisar y corregir **Mis datos** (nombre, teléfono, CURP, RFC y dirección) desde el menú de su cuenta.
- Seguir su avance con filtros, ver la fecha de sus citas y borrar sus datos privados cuando quiera
  (`/seguimiento`).
- Platicar con el asistente por texto o voz y pedir apoyo jurídico o psicológico (`/asistente`).
- Ver los números de emergencia aunque no tenga internet (`public/emergencia.html`).

**Personal de SEMujeres** (`/admin/*`, cada rol ve solo sus secciones)

| Área | Qué ve |
|---|---|
| Trabajo social | resumen, solicitudes nuevas, sus casos, expedientes y visitas |
| Jurídico y psicología | resumen de su área, sus casos con citas y contacto, y los expedientes |
| Asesoría económica | expedientes y revisión de empresas |
| Recepción | visitas previstas y registro de mujeres que llegan sin cita |
| Coordinación | expedientes, visitas y revisión de empresas |

En el expediente cada área lee completo solo lo suyo. Lo confidencial de otra área aparece como «En atención
jurídica desde 26 nov» o con candado.

**Empresas:** se registran y publican vacantes; una persona de SEMujeres las revisa antes de que salgan
(`/empresas/registro`, `/empresa`).

## Privacidad por diseño

- **Lo sensible va aparte y cifrado.** Las solicitudes de apoyo se guardan en una tabla separada y solo las ve
  el área que atiende. Cada lectura queda en una bitácora.
- **La seguridad está en la base de datos, no en los botones.** RLS de Supabase por rol; el navegador nunca
  escribe directo en las tablas.
- **Salida rápida** siempre visible (también con `Esc`): cambia la pantalla por una del clima y borra la
  conversación guardada.
- **La conversación no se guarda en el servidor.** Solo vive en la pestaña del navegador hasta cerrar sesión o
  usar la salida rápida.
- **La empresa ve lo mínimo:** nombre, teléfono, escolaridad, habilidades y experiencia. Nunca la CURP, la
  dirección ni nada de su atención en SEMujeres.
- **Consentimiento explícito**, guardando la fecha en que aceptó por primera vez, y un
  [aviso de privacidad](https://empoderate-umber.vercel.app/privacidad) en lenguaje claro.

## Accesibilidad

Lenguaje claro, de tú y con frases cortas. Dictado por voz en el asistente. Se puede usar con teclado y lector
de pantalla (ARIA) y respeta «reducir movimiento». Está pensada para celular con pocos datos y, sin conexión,
sigue mostrando los números de emergencia.

## Tecnología

React 18 + Vite, React Router, `motion` para las animaciones y Supabase Auth (correo y Google). Todos los datos
se piden a la API en FastAPI (`src/services/api.js`), nunca directo a las tablas.

```
src/
  modulos/        una carpeta por módulo, cada una con sus rutas y su servicio
    entrada/        registro, inicio de sesión, Google y nombre
    caminos/        caminos, explorar y completar perfil
    asistente/      chat con IA, dictado por voz y canalización
    expediente/     panel por área: resumen, solicitudes, casos, citas y expedientes
    recepcion/      visitas previstas y llegadas
    empresas/       registro de empresas, vacantes, candidatas y revisión
    portada/        sitio público y aviso de privacidad
  pages/          test, detalle de recurso, Mi avance y panel admin
  components/     átomos, moléculas, organismos y plantillas
  data/campos.js  copia del diccionario de campos (el oficial está en el backend)
  services/       cliente de la API, avisos, sesión, fechas y textos
public/
  sw.js           service worker: sin conexión muestra emergencia.html
  logo/           logo oficial en versión clara y oscura
  aliadas/        logos de las empresas aliadas
```

## Correr en local

Necesitas Node 20 o más y el backend corriendo (ver su README).

Crea un `.env.local` con:

```
VITE_SUPABASE_URL=https://<tu-proyecto>.supabase.co
VITE_SUPABASE_ANON_KEY=<anon key>
VITE_API_URL=http://localhost:8000
```

Y luego:

```bash
npm ci
npm run dev
```

`npm run build` genera `dist/`. Se despliega en Vercel (`vercel.json`). Si el cambio depende de una migración
nueva, despliega primero el backend.

## Documentos

- `PRODUCT.md`: para quién es, tono y restricciones.
- `DESIGN.md` y `PALETA.md`: sistema de diseño.
- `docs/diseno/`: maquetas por módulo.
