# Dominio propio: lexinauta.com con GoDaddy, Cloudflare y GitHub Pages

Guía paso a paso para usar **lexinauta.com** con DNS en **Cloudflare**, el registro en **GoDaddy** y el sitio ya publicado en **GitHub Pages**. Orden recomendado: primero Cloudflare y nameservers, luego DNS, después GitHub, y por último Jekyll (`_config.yml` y archivo `CNAME`).

---

## Qué vas a lograr

- Los visitantes entran por `https://lexinauta.com` (y opcionalmente `https://www.lexinauta.com`).
- El certificado HTTPS lo gestiona GitHub Pages en el origen; Cloudflare puede quedar solo como DNS o también como proxy (más abajo).

---

## Antes de empezar

- Repo del blog en GitHub con Pages funcionando (por ejemplo `https://14tinchov.github.io/lexinauta/`).
- Acceso a la cuenta de GoDaddy donde está **lexinauta.com**.
- Una cuenta en [Cloudflare](https://www.cloudflare.com/) (plan gratuito alcanza).

**Nota:** En los ejemplos se usa el usuario de GitHub **14tinchov** y el proyecto **lexinauta**, como en tu `_config.yml`. Si tu usuario u organización es otro, sustituí ese valor en los registros CNAME.

---

## Paso 1: Agregar el dominio en Cloudflare

1. Iniciá sesión en Cloudflare.
2. **Add a Site** / **Agregar un sitio** e ingresá `lexinauta.com`.
3. Elegí el plan **Free** y continuá.
4. Cloudflare va a **escanear** registros DNS existentes. Revisá la lista: podés borrar lo que no necesites (correo en GoDaddy, etc.) más adelante; lo crítico lo vas a definir en el paso 4.

Guardá los **dos nameservers** que Cloudflare te asigne (algo como `xxx.ns.cloudflare.com` e `yyy.ns.cloudflare.com`). Los vas a pegar en GoDaddy.

---

## Paso 2: Cambiar nameservers en GoDaddy

1. En GoDaddy: **My Products** → dominio **lexinauta.com** → **DNS** o **Manage DNS**.
2. Buscá la sección **Nameservers** y elegí **Change** / **Personalizado** (custom).
3. Sustituí los nameservers de GoDaddy por los **dos** que te dio Cloudflare.
4. Guardá los cambios.

La propagación puede tardar **desde minutos hasta 48 horas** (a veces menos de una hora). En Cloudflare, el sitio pasará a estado **Active** cuando detecte los nameservers correctos.

**Importante:** Una vez que el dominio usa Cloudflare, **la zona DNS autoritativa es Cloudflare**, no el panel DNS de GoDaddy. Los registros los editás en Cloudflare.

---

## Paso 3: Registros DNS en Cloudflare para GitHub Pages

En Cloudflare: **lexinauta.com** → **DNS** → **Records**.

### Opción A — Solo dominio raíz (`lexinauta.com`)

Agregá **cuatro** registros **A** para el apex (`@` o nombre del dominio según la UI):

| Tipo | Nombre | Contenido        | Proxy (nube) |
|------|--------|------------------|--------------|
| A    | `@`    | `185.199.108.153`| Ver nota    |
| A    | `@`    | `185.199.109.153`| Ver nota    |
| A    | `@`    | `185.199.110.153`| Ver nota    |
| A    | `@`    | `185.199.111.153`| Ver nota    |

**Nota sobre la nube:** Al principio conviene **DNS only** (nube **gris**) para evitar sorpresas con comprobaciones de GitHub. Cuando todo funcione, podés probar **Proxied** (nube naranja); si algo falla, volvé a gris.

### Opción B — También `www.lexinauta.com`

Agregá un **CNAME**:

| Tipo  | Nombre | Destino / Target      | Proxy      |
|-------|--------|------------------------|------------|
| CNAME | `www`  | `14tinchov.github.io` | gris al inicio |

GitHub puede redirigir entre `www` y apex según lo configures en Pages (más abajo).

Las IPs A anteriores son las [oficiales de GitHub Pages](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site#configuring-an-apex-domain) para el dominio raíz.

---

## Paso 4: Dominio personalizado en GitHub

1. Abrí el repo del sitio en GitHub.
2. **Settings** → **Pages** (en el menú lateral).
3. En **Custom domain**, escribí el dominio que querés como principal, por ejemplo:
   - `lexinauta.com`, o
   - `www.lexinauta.com`
4. Guardá. GitHub va a comprobar el DNS; puede tardar un poco hasta que los nameservers y registros estén propagados.
5. Cuando la verificación sea correcta, activá **Enforce HTTPS** si aparece la opción.

### Archivo `CNAME` en el repositorio (Jekyll)

Para que cada deploy no pierda el dominio, en la **raíz del repo** (junto a `_config.yml`) creá un archivo llamado **`CNAME`** (sin extensión) con **una sola línea**: exactamente el dominio que pusiste en GitHub, por ejemplo:

```text
lexinauta.com
```

o

```text
www.lexinauta.com
```

Debe coincidir con el **Custom domain** de Settings → Pages. Volvé a hacer push para que el workflow despliegue de nuevo.

---

## Paso 5: Ajustar Jekyll (`_config.yml`)

Con dominio propio en la raíz del host (sin subruta `/lexinauta` en la URL pública), la configuración típica es:

```yaml
url: "https://lexinauta.com"
baseurl: ""
```

Si tu dominio canónico fuera solo `www`:

```yaml
url: "https://www.lexinauta.com"
baseurl: ""
```

Tu `_config.yml` ya tiene un comentario con este cambio. Después de editar, commiteá y pusheá para regenerar el sitio.

---

## Paso 6: SSL en Cloudflare (si usás proxy naranja)

- Con nube **gris** (solo DNS), el visitante negocia HTTPS directo con GitHub; no hace falta tocar SSL en Cloudflare para que el sitio sea seguro.
- Con nube **naranja** (proxy), en **SSL/TLS** → **Overview** usá al menos **Full** (no **Flexible**), para no romper la cadena HTTPS entre Cloudflare y GitHub.

---

## Comprobaciones rápidas

- Desde la terminal: `dig lexinauta.com +short` debería mostrar las IPs de GitHub (si el apex es A) o, si probás `www`, el CNAME hacia `github.io`.
- Navegador: `https://lexinauta.com` carga el blog sin avisos de certificado mixto.
- En GitHub → **Pages**, el dominio aparece como verificado y **Enforce HTTPS** activo.

---

## Problemas frecuentes

| Síntoma | Qué revisar |
|---------|----------------|
| GitHub no verifica el dominio | Nameservers ya en GoDaddy apuntando a Cloudflare; registros A/CNAME correctos; esperar propagación. |
| Bucle de redirecciones | Proxy naranja con SSL **Flexible**; cambiar a **Full** o usar DNS only (gris). |
| Sitio en blanco o 404 | `baseurl` en `_config.yml` debe ser `""` con dominio propio en raíz; archivo `CNAME` presente y coincidente con Settings. |
| Sigue abriéndose la URL `github.io` | Normal hasta que actualices enlaces; el canónico lo define `url` en `_config.yml`. |

---

## Orden resumido (checklist)

1. [ ] Sitio agregado en Cloudflare y nameservers copiados.
2. [ ] Nameservers actualizados en GoDaddy; dominio **Active** en Cloudflare.
3. [ ] Registros DNS (A en apex y, si aplica, CNAME `www`) hacia GitHub Pages.
4. [ ] **Settings** → **Pages** → **Custom domain** + **Enforce HTTPS**.
5. [ ] Archivo **`CNAME`** en la raíz del repo con el mismo dominio.
6. [ ] **`_config.yml`**: `url` con `https://…` y `baseurl: ""`.
7. [ ] Push a `main` y comprobar el sitio en HTTPS.

Documentación oficial útil: [Configuring a custom domain for GitHub Pages](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site).
