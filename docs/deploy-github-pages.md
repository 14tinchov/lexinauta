# Deploy a GitHub Pages (recomendado para este repo)

Este proyecto usa Jekyll con `github-pages` en el Gemfile. La estrategia recomendada para `lexinauta` es:

- desarrollar en `main`
- dejar que GitHub Actions haga el build
- publicar con GitHub Pages desde ese workflow

Asi evitas mantener una rama de build manual (`gh-pages`) y reduces desincronizaciones.

## 1) Configurar Pages en GitHub

1. Ir al repo en GitHub.
2. `Settings` -> `Pages`.
3. En `Source`, elegir **GitHub Actions**.

## 2) Workflow recomendado (Actions + main)

Crear el archivo:

- `.github/workflows/pages.yml`

Contenido sugerido:

```yaml
name: Deploy Jekyll site to Pages

on:
  push:
    branches: ["main"]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Setup Pages
        uses: actions/configure-pages@v5
      - name: Build with Jekyll
        uses: actions/jekyll-build-pages@v1
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

## 3) Ajustar `_config.yml`

Revisar estos campos antes del primer deploy:

- `url`
- `baseurl`

Casos tipicos:

1. Sitio de usuario (`usuario.github.io`)
   - `url: "https://usuario.github.io"`
   - `baseurl: ""`

2. Sitio de proyecto (`usuario.github.io/lexinauta`)
   - `url: "https://usuario.github.io"`
   - `baseurl: "/lexinauta"`

## 4) Flujo diario recomendado

```bash
bundle exec jekyll build
# opcional: bundle exec jekyll serve

git add .
git commit -m "nuevo post"
git push origin main
```

Con ese push, GitHub Actions construye y publica.

## 5) Que hacer con `gh-pages` (tu flujo anterior)

Se puede usar, pero para este repo no es lo ideal como flujo principal:

- agrega pasos manuales para build/publicacion
- duplica trabajo
- puede quedar desincronizado respecto a `main`

## Alternativa resumida si queres seguir con `gh-pages`

1. `bundle exec jekyll build`
2. Publicar el contenido de `_site` en la rama `gh-pages`
3. En `Settings` -> `Pages`, usar `Deploy from branch` (`gh-pages` / root)

Funciona, pero es mas simple mantener **Actions + main**.

## 6) Dominio propio con GoDaddy + Cloudflare (compatible con Pages)

Si despues queres usar dominio propio, este stack funciona bien:

- Hosting: GitHub Pages
- DNS / SSL / proxy: Cloudflare
- Registrar del dominio: GoDaddy

Pasos resumidos:

1. Agregar el dominio a Cloudflare.
2. En GoDaddy, cambiar nameservers a los de Cloudflare.
3. En GitHub (`Settings` -> `Pages`), configurar tu custom domain.
4. En Cloudflare, crear registros DNS apuntando a GitHub Pages.
5. Activar HTTPS en GitHub Pages.

Recomendacion para evitar problemas al inicio:

- dejar los registros como **DNS only** (nube gris) hasta validar que Pages responde bien.
- despues, si queres, probar **Proxied** (nube naranja).

Segun el tipo de sitio:

- Dominio raiz (`midominio.com`): `url: "https://midominio.com"` y `baseurl: ""`
- Subdominio (`blog.midominio.com`): `url: "https://blog.midominio.com"` y `baseurl: ""`

## Checklist del primer deploy

- `url` y `baseurl` correctos en `_config.yml`
- `Settings` -> `Pages` en modo GitHub Actions
- workflow en `.github/workflows/pages.yml`
- push a `main`
- revisar `Actions` y luego la URL de Pages
