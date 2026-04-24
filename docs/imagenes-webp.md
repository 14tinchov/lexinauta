# Receta rápida de imágenes (source ignorado + WebP)

Este proyecto usa un flujo simple:

1. Editás imágenes en alta calidad en una carpeta **fuera de versionado**.
2. Exportás versiones optimizadas a **WebP**.
3. Subís al repo solo los WebP finales en `assets/images/posts/...`.

## 0) ¿Cuántas imágenes de portada hacen falta?

**Una sola** imagen de portada por post: el mismo archivo que definís en `featured_image` se usa en todos estos lugares:

| Dónde se ve | Rol en el HTML/CSS |
|-------------|---------------------|
| Primer post del listado (bloque “Destacado”) | `.hero-featured__media-img` |
| Tarjetas del grid en el índice | `.post-card__image` dentro de `.post-card__media` |
| Cabecera al abrir el post | `.post-hero__media img` |
| “Más publicaciones” al pie del post | `.related-post-card__image` |

No tenés que exportar tres tamaños distintos para la portada: el navegador escala y recorta **la misma** imagen con `object-fit: cover` según el bloque.

Las clases con sufijo **`--fallback`** (por ejemplo `.hero-featured__media--fallback`, `.post-hero__media--fallback`) **no son otra imagen**: son un fondo decorativo (degradado o gris) que solo aparece cuando **no** definiste `featured_image` en el front matter.

**Composición:** en desktop el destacado usa un marco **4:5**; la cabecera del post **16:9**; las tarjetas son una franja baja (~`10rem` de alto). Con una sola foto conviene un encuadre que siga funcionando cuando se recorta (sujeto un poco centrado, margen alrededor).

## 1) Carpetas recomendadas

- **No versionada** (source): `source-images/`
- **Versionada** (publicada): `assets/images/posts/`

Ejemplo para un post:

- `source-images/mi-post/cover.psd`
- `source-images/mi-post/foto-original.jpg`
- `assets/images/posts/mi-post/cover.webp`
- `assets/images/posts/mi-post/imagen-01.webp`

## 2) Tamaños recomendados

- **Portada (`featured_image`)**: exportá **un** WebP con unos **`1600px` de ancho** (ratio libre; el tema recorta en pantalla). Ese archivo alimenta destacado, cards y cabecera del post.
- **Imágenes dentro del Markdown** (opcionales): unos **`1200px` de ancho** suelen alcanzar para el cuerpo del artículo sin pesar de más.

No hace falta una versión aparte “solo para miniatura”: las cards muestran la misma portada en un recuadro chico.

## 3) Peso objetivo

- Portada (`featured_image`, ~1600px): `150-350 KB` (misma archivo sirve para todo el sitio; al bajar mucho el peso puede verse peor en la cabecera ancha del post).
- Inline en Markdown: `80-250 KB`

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
