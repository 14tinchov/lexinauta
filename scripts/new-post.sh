#!/usr/bin/env bash
# Crea un archivo en _posts/ con la fecha de hoy: YYYY-MM-DD-slug.md
# y carpetas para imágenes: source-images/<slug>/ (fuentes, gitignored) y
# assets/images/posts/<slug>/ (webp exportados).
# Uso:
#   scripts/new-post.sh mi-slug-kebab
#   scripts/new-post.sh "Título con acentos y espacios"
# Si el texto solo tiene minúsculas, números y guiones, se usa tal cual como slug.
# Si no, se genera el slug a partir del texto (quita acentos, pone guiones).

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
POSTS_DIR="$ROOT/_posts"
SOURCE_IMAGES_DIR="$ROOT/source-images"
ASSETS_POST_IMAGES_DIR="$ROOT/assets/images/posts"

if [[ ! -d "$POSTS_DIR" ]]; then
  echo "No encontré _posts/ en $ROOT — ¿corriste el script desde el repo lexinauta?" >&2
  exit 1
fi

if [[ $# -lt 1 ]]; then
  echo "Uso: $0 <slug-o-título>" >&2
  echo "Ejemplos:" >&2
  echo "  $0 notas-sobre-jekyll" >&2
  echo "  $0 \"Lo que aprendí esta semana\"" >&2
  exit 1
fi

raw="$*"

python3_for_slug() {
  if [[ -x /usr/bin/python3 ]]; then
    printf '%s\n' /usr/bin/python3
  elif command -v python3 >/dev/null 2>&1; then
    command -v python3
  fi
}

slugify() {
  local input="$1"
  local py
  py="$(python3_for_slug)" || true
  if [[ -n "$py" ]]; then
    "$py" - "$input" <<'PY'
import re, sys, unicodedata
s = sys.argv[1].strip()
if not s:
    print("post", end="")
    sys.exit(0)
s = "".join(
    c for c in unicodedata.normalize("NFD", s) if unicodedata.category(c) != "Mn"
)
s = s.lower()
s = re.sub(r"[^a-z0-9]+", "-", s)
s = re.sub(r"-{2,}", "-", s).strip("-")
print(s or "post", end="")
PY
    return
  fi
  # Sin Python: solo ASCII aproximado (pasá un slug kebab a mano si hace falta)
  printf '%s' "$input" | tr '[:upper:]' '[:lower:]' | tr ' _' '--' | tr -cd 'a-z0-9-\n' \
    | sed 's/--*/-/g;s/^-\|-$//g' | head -c 200
}

if [[ "$raw" =~ ^[a-z0-9-]+$ ]]; then
  slug="$raw"
else
  slug="$(slugify "$raw")"
fi

if [[ -z "$slug" ]]; then
  echo "No pude generar un slug válido." >&2
  exit 1
fi

today="$(date +%Y-%m-%d)"
filepath="$POSTS_DIR/${today}-${slug}.md"

if [[ -e "$filepath" ]]; then
  echo "Ya existe: $filepath" >&2
  exit 1
fi

escape_yaml_double() {
  printf '%s' "$1" | sed 's/\\/\\\\/g; s/"/\\"/g'
}

title_esc="$(escape_yaml_double "$raw")"

post_src_dir="$SOURCE_IMAGES_DIR/$slug"
post_assets_dir="$ASSETS_POST_IMAGES_DIR/$slug"

mkdir -p "$post_src_dir" "$post_assets_dir"
# Carpeta de salida versionada; source-images suele estar en .gitignore
touch "$post_assets_dir/.gitkeep"

cat >"$filepath" <<EOF
---
layout: post
title: "$title_esc"
subtitle: "$title_esc"
categories:
  - Apuntes
comments: true
---

<!-- Imágenes: fuentes en source-images/$slug/ → webp en assets/images/posts/$slug/ (ej. cover.webp en featured_image) -->

Empezá a escribir acá.

EOF

echo "Creado: $filepath"
echo "Carpeta fuentes (local): $post_src_dir"
echo "Carpeta webp:           $post_assets_dir"

if [[ -n "${EDITOR:-}" ]]; then
  exec "$EDITOR" "$filepath"
fi
