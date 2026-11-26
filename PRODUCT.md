# Empoderate — producto

## Qué es
Plataforma de orientación, evaluación, seguimiento y canalización para mujeres de Los Mochis / Ahome, Sinaloa. Un test base de 12 preguntas define una **ruta** (empleabilidad, emprendimiento o capacitación, más una ruta puente) y recomienda recursos reales y verificados. Además ofrece canalización discreta a apoyo jurídico y psicológico de CEMujeres.

## Quién la usa
- **Usuarias:** mujeres adultas, muchas desde el celular con datos limitados, con tiempo escaso por trabajo o cuidados y con distintos niveles de lectura. Algunas pueden estar en una situación de riesgo.
- **Personal de CEMujeres:** asesoras y especialistas que dan seguimiento, atienden canalizaciones y mantienen el catálogo (panel `/admin`).

## Tono
Confianza, calma, claridad institucional moderna y cercanía humana. Nunca infantil, clínica, alarmista ni saturada. Lenguaje claro y frases cortas, de tú.

## Restricciones
- Pocos datos móviles: sin autoplay ni videos y con dependencias mínimas.
- Texto grande y ajustable (A− / A+).
- Zona sensible: solo morados, sin rojos de alerta. Salida rápida siempre visible (también con Esc). Nada se guarda sin consentimiento expreso.
- Datos personales conforme a la LFPDPPP.
- Lógica de negocio en `src/services/` y datos en `src/data/`; la capa visual no los modifica.

## Superficies y modo
| Superficie | Rutas | Modo |
|---|---|---|
| Portal | `/` | Persuadir: orientar sin fricción hacia el test |
| App de la usuaria | `/registro`, `/test`, `/resultado`, `/dashboard`, `/recurso/:id`, `/seguimiento`, `/chat`, `/apoyo` | Operar |
| Panel CEMujeres | `/admin/*` | Operar |
