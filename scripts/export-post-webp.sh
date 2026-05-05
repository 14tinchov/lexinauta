#!/usr/bin/env bash
# Convierte imágenes de source-images/<slug>/ a WebP en assets/images/posts/<slug>/.
# Usa cwebp como en docs/imagenes-webp.md (brew install webp).
#
# Uso:
#   scripts/export-post-webp.sh <slug>
#   scripts/export-post-webp.sh <slug> --max-width 1200
#   scripts/export-post-webp.sh <slug> --no-resize
#   scripts/export-post-webp.sh <slug> -q 82
#
# Por defecto: calidad 80, y en macOS encaja el lado mayor a 1600px (sips -Z, sin agrandar).

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
SRC_ROOT="$ROOT/source-images"
DST_ROOT="$ROOT/assets/images/posts"

usage() {
  cat <<'EOF'
Convierte imágenes de source-images/<slug>/ a WebP en assets/images/posts/<slug>/.

Argumentos:
  <slug>              Nombre de carpeta (igual que en new-post.sh), ej. mi-post

Opciones:
  -w, --max-width N   Lado mayor máximo en px antes de WebP (solo macOS con sips). Por defecto 1600.
  --no-resize         No redimensiona; solo cwebp.
  -q, --quality N     Calidad cwebp (0-100). Por defecto 80.

Ejemplo:
  scripts/export-post-webp.sh empezar-ahora-sigue-siendo-mejor-que-no-empezar
EOF
}

SLUG=""
MAX_W=1600
QUALITY=80

while [[ $# -gt 0 ]]; do
  case "$1" in
    -h | --help)
      usage
      exit 0
      ;;
    -w | --max-width)
      MAX_W="${2:-}"
      if [[ -z "$MAX_W" || ! "$MAX_W" =~ ^[0-9]+$ ]]; then
        echo "Falta número válido después de $1" >&2
        exit 1
      fi
      shift 2
      ;;
    --no-resize)
      MAX_W=0
      shift
      ;;
    -q | --quality)
      QUALITY="${2:-}"
      if [[ -z "$QUALITY" || ! "$QUALITY" =~ ^[0-9]+$ ]]; then
        echo "Falta número válido después de $1" >&2
        exit 1
      fi
      shift 2
      ;;
    -*)
      echo "Opción desconocida: $1 (probá --help)" >&2
      exit 1
      ;;
    *)
      if [[ -n "$SLUG" ]]; then
        echo "Solo un slug; sobró: $1" >&2
        exit 1
      fi
      SLUG="$1"
      shift
      ;;
  esac
done

if [[ -z "$SLUG" ]]; then
  usage >&2
  exit 1
fi

if ! command -v cwebp >/dev/null 2>&1; then
  echo "No está cwebp. Instalación: brew install webp" >&2
  exit 1
fi

SRC="$SRC_ROOT/$SLUG"
DST="$DST_ROOT/$SLUG"

if [[ ! -d "$SRC" ]]; then
  echo "No existe la carpeta fuente: $SRC" >&2
  exit 1
fi

mkdir -p "$DST"

count=0
attempted=0
while IFS= read -r -d '' f; do
  attempted=$((attempted + 1))
  base="$(basename "$f")"
  stem="${base%.*}"
  stem_lower="$(printf '%s' "$stem" | tr '[:upper:]' '[:lower:]')"
  out="$DST/${stem_lower}.webp"
  work="$f"
  tmp_resize=""

  if [[ "$(uname -s)" == Darwin && "$MAX_W" -gt 0 ]]; then
    tmp_resize="$(mktemp "${TMPDIR:-/tmp}/lex-webp.XXXXXX")"
    if sips -Z "$MAX_W" "$f" --out "$tmp_resize" >/dev/null 2>&1; then
      work="$tmp_resize"
    else
      rm -f "$tmp_resize"
      tmp_resize=""
    fi
  fi

  if cwebp -quiet -q "$QUALITY" "$work" -o "$out"; then
    echo "OK  $base → $(basename "$out")"
    count=$((count + 1))
  else
    echo "FAIL $base" >&2
  fi

  [[ -n "$tmp_resize" ]] && rm -f "$tmp_resize"
done < <(find "$SRC" -maxdepth 1 -type f \( \
  -iname '*.jpg' -o -iname '*.jpeg' -o -iname '*.png' \
  -o -iname '*.tif' -o -iname '*.tiff' -o -iname '*.webp' \) -print0)

if [[ "$count" -eq 0 ]]; then
  if [[ "$attempted" -eq 0 ]]; then
    echo "No encontré imágenes convertibles (.jpg .jpeg .png .tif .tiff .webp) en $SRC" >&2
  else
    echo "Había $attempted archivo(s) pero ninguna conversión salió bien." >&2
  fi
  exit 1
fi

echo "Listo: $count archivo(s) en $DST"
