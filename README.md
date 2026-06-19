# VIGALTEC — Landing Page

Landing page premium para **VIGALTEC · Estructuras Metálicas**.
HTML5 + CSS3 + JavaScript vanilla (sin frameworks). Imágenes reales optimizadas a WebP.

## Cómo verla

```bash
# opción 1 (recomendada): servidor local
node serve.js          # abre http://localhost:5222

# opción 2: abrir index.html directamente en el navegador
```

## Estructura

```
index.html          → marcado + SEO + datos estructurados
css/style.css       → todo el diseño y responsive
js/main.js          → loader, animaciones, galería, slider, formulario
assets/img/         → fondos de sección (hero, about, why, cta)
assets/projects/    → galería (versión completa + miniatura -thumb)
build-images.js     → re-genera las WebP desde C:\Users\Lenovo\Desktop\VIGALTEC
```

## ⚠️ Datos por reemplazar (placeholders)

Edita estos valores con la información real del cliente:

### 1. Contacto — `js/main.js` (objeto `CONFIG`, arriba del archivo)
- `waNumber`  → número de WhatsApp real, formato internacional sin `+` ni espacios. Ej: `573001234567`
- `phoneDisplay` → cómo se muestra el teléfono. Ej: `+57 300 123 4567`
- `email` → correo real
- `address` → ciudad / dirección real

> El teléfono, correo y dirección se inyectan automáticamente en la sección Contacto y el footer.

### 2. Redes sociales — `index.html` (footer)
Reemplaza los `href="#"` de Facebook, Instagram, WhatsApp y TikTok por las URLs reales.

### 3. Cifras / contadores (opcional, ajustar a la realidad)
- Sección **¿Por qué elegirnos?**: `data-count` (250 proyectos, 180 clientes, 12 años, 500 estructuras).
- Hero (mini-stats) y badge de la sección Nosotros (`12+ años`).

### 4. Testimonios — `index.html` (sección `#testimonios`)
Los nombres y textos son de ejemplo. Reemplázalos por testimonios reales.

### 5. Dominio — `index.html` (`<head>`)
Cambia `https://www.vigaltec.com/` en `canonical`, `og:url` y el JSON-LD por el dominio real.

## Regenerar imágenes

Si cambian las fotos en `C:\Users\Lenovo\Desktop\VIGALTEC`:

```bash
npm install      # instala sharp (solo la primera vez)
node build-images.js
```

## Paleta

| Color | Hex |
|-------|-----|
| Negro carbón | `#111111` |
| Gris acero | `#2D2D2D` |
| Gris metálico | `#5A5A5A` |
| Blanco | `#FFFFFF` |
| Naranja industrial | `#FF6B00` |

Tipografías: **Oswald** (títulos) + **Inter** (texto).
