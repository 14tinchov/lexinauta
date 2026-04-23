# Crear un nuevo post en lexinauta

Esta guía resume el flujo diario para escribir y publicar entradas en este blog Jekyll.

## 1) Publicar un post nuevo

1. Crear archivo dentro de `_posts/` con este formato de nombre:
   - `YYYY-MM-DD-titulo-del-post.md`
   - Ejemplo: `2026-04-23-mi-primer-post-real.md`
2. Agregar front matter.
3. Escribir el contenido en Markdown.
4. Probar localmente.
5. Commit + push.

## 2) Front matter recomendado

```yaml
---
layout: post
title: "Título del post"
subtitle: "(Opcional) bajada corta"
categories:
  - tecnologia
comments: true
featured_image: "/assets/images/posts/mi-post/cover.webp"
featured_image_alt: "Descripción breve de la portada"
---
```

Notas:
- `layout: post` usa el diseño del blog.
- `categories` muestra el chip de categoría en cards/header.
- `comments: true` habilita Disqus en ese post (si `disqus_shortname` está configurado en `_config.yml`).
- `featured_image` se usa como portada en `index`, cards y hero del post individual.

## 3) Plantilla completa para copiar

```markdown
---
layout: post
title: "Cómo organizo ideas técnicas"
subtitle: "Un flujo simple con drafts + publicación semanal"
categories:
  - notas
comments: true
featured_image: "/assets/images/posts/mi-post/cover.webp"
featured_image_alt: "Portada del post"
---

Acá va la introducción.

## Sección

Contenido...
```

## 4) Cómo escribir para que se vea como el diseño

No hace falta sintaxis rara: con Markdown estándar ya podés lograr casi todo.

### Subtítulo grande dentro del post

Usá un `##`:

```markdown
## THE TACTILE DIGITAL
```

En el tema actual se renderiza con estilo editorial fuerte (mayúsculas + subrayado).

### Caja tipo callout ("Perfection is boring...")

Usá `blockquote`:

```markdown
> PERFECTION IS BORING. STRUCTURAL HONESTY IS ENGAGING.
```

El CSS del post lo transforma en una caja destacada neo-brutalist.

### Imágenes dentro del contenido

Usá Markdown normal:

```markdown
![Alt de la imagen](/assets/images/posts/mi-post/imagen-01.webp)
```

Estilo aplicado automáticamente:
- ancho completo del contenido
- borde/sombra neo-brutalist
- espaciado consistente

Estructura recomendada para assets:

- `assets/images/posts/mi-post/cover.webp`
- `assets/images/posts/mi-post/imagen-01.webp`
- `assets/images/posts/mi-post/imagen-02.webp`

## 5) Trabajar con borradores (`_drafts`)

Para ideas rápidas, crear un archivo en `_drafts/` sin fecha:
- `_drafts/mi-idea.md`

Ver borradores en local:

```bash
bundle exec jekyll serve --drafts
```

Cuando el texto esté listo, moverlo a `_posts/` y renombrar con fecha:
- de: `_drafts/mi-idea.md`
- a: `_posts/2026-04-23-mi-idea.md`

## 6) Vista local y validación

Instalar dependencias (primera vez):

```bash
bundle install
```

Levantar sitio local:

```bash
bundle exec jekyll serve
```

Build de validación:

```bash
bundle exec jekyll build
```

## 7) Checklist antes de publicar

- Archivo en `_posts/` con nombre `YYYY-MM-DD-slug.md`.
- Front matter válido (con `---` al inicio y fin).
- Texto en UTF-8 (el proyecto ya está en `encoding: utf-8`).
- Revisado en local (`serve` o `build`).
- Categoría y título correctos.
- `featured_image` y `featured_image_alt` completos si el post tiene portada.
- Al menos un `##` y/o `blockquote` si querés aprovechar el estilo editorial.

## 8) Referencias del proyecto

- Config principal: `_config.yml`
- Post de ejemplo: `_posts/2026-04-22-bienvenida-a-lexinauta.md`
- Borrador de ejemplo: `_drafts/ejemplo-idea.md`
- Receta de imágenes WebP: `docs/imagenes-webp.md`
