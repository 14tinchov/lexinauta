# Receta rápida de imágenes (source ignorado + WebP)

Este proyecto usa un flujo simple:

1. Editás imágenes en alta calidad en una carpeta **fuera de versionado**.
2. Exportás versiones optimizadas a **WebP**.
3. Subís al repo solo los WebP finales en `assets/images/posts/...`.

## 1) Carpetas recomendadas

- **No versionada** (source): `source-images/`
- **Versionada** (publicada): `assets/images/posts/`

Ejemplo para un post:

- `source-images/mi-post/cover.psd`
- `source-images/mi-post/foto-original.jpg`
- `assets/images/posts/mi-post/cover.webp`
- `assets/images/posts/mi-post/imagen-01.webp`

## 2) Tamaños recomendados

- Portada hero: `1600px` de ancho
- Imagen dentro de post: `1200px` de ancho
- Miniatura/card: `800px` de ancho

## 3) Peso objetivo

- Hero: `150-350 KB`
- Inline: `80-250 KB`
- Miniatura: `40-120 KB`

## 4) Conversión rápida en Mac (cwebp)

Instalación (una sola vez):

```bash
brew install webp
```

Convertir una imagen:

```bash
cwebp -q 80 source-images/mi-post/cover.jpg -o assets/images/posts/mi-post/cover.webp
```

Convertir todas las JPG de una carpeta:

```bash
mkdir -p assets/images/posts/mi-post
for f in source-images/mi-post/*.jpg; do
  name=$(basename "$f" .jpg)
  cwebp -q 80 "$f" -o "assets/images/posts/mi-post/${name}.webp"
done
```

## 5) Uso en front matter del post

```yaml
---
layout: post
title: "Mi post"
featured_image: "/assets/images/posts/mi-post/cover.webp"
featured_image_alt: "Descripción breve de la portada"
---
```

## 6) Imagen dentro del contenido Markdown

```markdown
![Descripción de la imagen](/assets/images/posts/mi-post/imagen-01.webp)
```

## 7) Checklist antes de commitear

- No subir `source-images/` al repo.
- Subir solo `.webp` optimizados.
- Verificar peso final.
- Revisar que `featured_image` y rutas de Markdown apunten a `assets/images/posts/...`.
