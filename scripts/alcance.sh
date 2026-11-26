#!/usr/bin/env bash
# Revisa que la rama actual solo toque archivos de su módulo.
# Uso: scripts/alcance.sh <N>   (N = 0..7)   · Sale con 1 y lista los archivos ajenos.
set -euo pipefail
N="${1:?Uso: scripts/alcance.sh <numero de modulo 0-7>}"
BASE="${BASE:-origin/main}"
if [ -f package.json ]; then REPO=frontend; else REPO=backend; fi

case "$REPO:$N" in
  frontend:1) P='^src/modulos/entrada/|^src/lib/supabase\.js$|^src/pages/Registro\.jsx$' ;;
  frontend:2) P='^src/modulos/asistente/|^src/pages/Chat\.jsx$' ;;
  frontend:3) P='^src/modulos/caminos/|^src/pages/(Dashboard|Seguimiento|RecursoDetalle)\.jsx$' ;;
  frontend:4) P='^src/modulos/expediente/' ;;
  frontend:5) P='^src/modulos/recepcion/' ;;
  frontend:6) P='^src/modulos/empresas/' ;;
  frontend:7) P='^src/modulos/portada/|^src/pages/(Home|Apoyo)\.jsx$|^src/components/organisms/(HomeSections|HeroSection|SiteHeader|SiteFooter|BannerCarousel)\.jsx$|^src/components/organisms/index\.js$|^src/styles/home\.css$' ;;
  backend:2) P='^app/modulos/asistente/|^tests/test_m2_' ;;
  backend:3) P='^app/modulos/caminos/|^scripts/etiquetar_catalogo\.py$|^tests/test_m3_' ;;
  backend:4) P='^app/modulos/expediente/|^tests/test_m4_' ;;
  backend:5) P='^app/modulos/recepcion/|^tests/test_m5_' ;;
  backend:6) P='^app/modulos/empresas/|^tests/test_m6_' ;;
  backend:7) P='^app/modulos/portada/|^tests/test_m7_' ;;
  *:0) echo "M0 es la base: puede tocar archivos compartidos."; exit 0 ;;
  backend:1) P='^$' ;;
  *) echo "Módulo desconocido: $N"; exit 2 ;;
esac

AJENOS=$(git diff --name-only "$BASE"...HEAD | grep -Ev "$P" || true)
if [ -n "$AJENOS" ]; then
  echo "✗ La rama toca archivos que no son del módulo $N ($REPO):"
  echo "$AJENOS" | sed 's/^/  - /'
  echo "Pídele el cambio a quien lleva M0."
  exit 1
fi
echo "✓ Alcance correcto para el módulo $N ($REPO)."
