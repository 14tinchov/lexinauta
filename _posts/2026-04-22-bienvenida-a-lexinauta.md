---
layout: post
title: "Bienvenida a lexinauta"
subtitle: "Un arranque mínimo para el blog: borradores, UTF-8 y GitHub Pages."
categories:
  - meta
featured_image: "/assets/images/posts/bienvenida/cover.png"
featured_image_alt: "Arquitectura brutalista en blanco y negro"
---

Este es un post de ejemplo. Borralo o reemplazalo cuando quieras.

## The tactile digital

Cuando escribís con Markdown normal (`##`, `>`, imágenes), el diseño del post ya aplica el estilo neo-brutalista.

> Perfection is boring. Structural honesty is engaging.

![Arquitectura brutalista](/assets/images/posts/bienvenida/cover.png)

Los borradores van en `_drafts/` (sin fecha en el nombre del archivo). Para verlos en local:

```bash
bundle exec jekyll serve --drafts
```

Encoding del sitio: **UTF-8** en `_config.yml` y en el layout, así podés usar ñ, tildes y comillas sin drama.
