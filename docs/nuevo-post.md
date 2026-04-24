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

### Destacado en el índice (bloque “Destacado”)

No hay un campo tipo `featured: true` en el front matter. El tema toma **el primer post de la página actual** del paginador:

- En la plantilla: `paginator.posts | first`.
- Jekyll ordena los posts **del más nuevo al más viejo** por defecto.
- En la **página 1** del blog (`/` o `index.html`), eso es casi siempre **la entrada con fecha más reciente** entre las que entran en esa página (`paginate` está en `5` en `_config.yml`, así que son las 5 más nuevas; la primera va al destacado y las otras 4 al grid).

Para que un post sea el destacado en la home: publicalo con **fecha igual o posterior** a las demás entradas de esa primera página (o sea, que quede primero al ordenar por fecha). En `/pagina/2/`, el “Destacado” es el primero de **ese** lote (el sexto más nuevo del sitio, etc.), no el mismo que en la home.

Si en el futuro querés **fijar** un post concreto sin depender de la fecha, habría que cambiar la plantilla (por ejemplo leer un `site.featured_post` en `_config.yml` o un campo en el front matter).

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

### Motor: Kramdown + GFM

En `_config.yml` el sitio usa **Kramdown** con **`input: GFM`** (GitHub Flavored Markdown). Eso habilita lo habitual de GitHub además del Markdown clásico: por ejemplo **tablas con pipes**, **tachado** `~~texto~~`, **bloques de código** con triple backtick y, en general, el mismo estilo de escritura que en un `README.md` en GitHub.

No hay plugins extra de Markdown en el proyecto: el `Gemfile` usa el paquete **`github-pages`**, que incluye **Rouge** para resaltado de sintaxis en bloques con etiqueta de lenguaje. El HTML puede traer clases de resaltado, pero el CSS del tema **no** define colores por token: el bloque igual se ve enmarcado (ver más abajo).

### Resumen: qué estiliza el tema

Las reglas viven bajo `.post-content` en `assets/css/style.css`. Referencia rápida:

| Usás | Resultado en pantalla |
|------|------------------------|
| `##` y `###` | Títulos con tipografía display (h2 con borde inferior grueso). |
| `> …` | Caja tipo callout neo-brutalista (no es solo una cita gris). |
| `![alt](ruta)` | Imagen a ancho útil, borde y sombra. |
| `[texto](url)` | Enlace con color primario, subrayado grueso y hover. |
| `-` / `1.` | Listas con sangría y márgenes coherentes. |
| `` `código` `` y bloques ` ``` ` | Monoespaciado; los `pre` con borde, sombra y scroll horizontal. |
| `#`, `####`… | Funcionan, pero **sin** reglas de diseño específicas (se ven más “planos”). |
| Tablas GFM, `---`, etc. | Se renderizan bien; **sin** estilos de tabla o regla a medida en el CSS del post. |

### Subtítulo grande dentro del post

Usá un `##`:

```markdown
## THE TACTILE DIGITAL
```

En el tema actual se renderiza con estilo editorial fuerte (mayúsculas + subrayado).

Para un nivel intermedio, `###` también tiene estilo display (más chico que `##`). Evitá `#` en el cuerpo si no querés competir visualmente con el título del layout (el `<h1>` ya es el título del post).

### Caja tipo callout ("Perfection is boring...")

Usá `blockquote`:

```markdown
> PERFECTION IS BORING. STRUCTURAL HONESTY IS ENGAGING.
```

El CSS del post lo transforma en una caja destacada neo-brutalist.

### Listas y texto enfatizado

Listas ordenadas o no, y énfasis estándar:

```markdown
- ítem
- otro

1. primero
2. segundo

**negrita** y *cursiva* (o _cursiva_).
```

### Enlaces

```markdown
[Léeme](https://ejemplo.com)
```

Rutas internas al sitio pueden usar ruta absoluta desde la raíz del sitio (respetando `baseurl` en producción) o **Liquid** (ver más abajo).

### Código inline y bloques

Inline:

```markdown
Usá `bundle exec jekyll serve` en la terminal.
```

Bloque con idioma (útil para que Rouge genere clases, aunque el color fino no esté en el CSS del tema):

````markdown
```bash
bundle exec jekyll build
```
````

### Imágenes dentro del contenido

Usá Markdown normal:

```markdown
![Alt de la imagen](/assets/images/posts/mi-post/imagen-01.webp)
```

Si necesitás que la URL respete `baseurl` en GitHub Pages, podés usar Liquid como en el post de ejemplo (en un post real, las llaves van sin escapar; acá van dentro de `raw` para que esta guía no las ejecute Jekyll al buildear):

{% raw %}
```markdown
![Alt]({{ '/assets/images/posts/mi-post/foto.webp' | relative_url }})
```
{% endraw %}

Estilo aplicado automáticamente a las imágenes del cuerpo:

- ancho completo del contenido (máximo del contenedor)
- borde/sombra neo-brutalist
- espaciado consistente

Estructura recomendada para assets:

- `assets/images/posts/mi-post/cover.webp`
- `assets/images/posts/mi-post/imagen-01.webp`
- `assets/images/posts/mi-post/imagen-02.webp`

### Tablas, tachado y separador

Ejemplos GFM que podés pegar tal cual:

```markdown
| Columna A | Columna B |
|-----------|-----------|
| dato      | dato      |

~~texto tachado~~

---
```

La tabla y la regla horizontal se verán correctas pero con apariencia “por defecto” del navegador (no hay CSS de tabla/regla específico en el prose del post).

### Liquid dentro del post

Jekyll procesa **Liquid** en el Markdown antes de convertir a HTML. Además de `relative_url` en imágenes, podés usar filtros y variables de sitio cuando haga falta; si algo no compila, revisá bloques Liquid mal cerrados o caracteres que Liquid interprete por error (en duda, probá en local con `jekyll serve`).

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
