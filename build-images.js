// Optimización de imágenes VIGALTEC -> WebP responsive
// Fuente: C:\Users\Lenovo\Desktop\VIGALTEC  (PNG reales del cliente)
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const SRC = 'C:\\Users\\Lenovo\\Desktop\\VIGALTEC';
const OUT_PROJ = path.join(__dirname, 'assets', 'projects');
const OUT_IMG = path.join(__dirname, 'assets', 'img');

fs.mkdirSync(OUT_PROJ, { recursive: true });
fs.mkdirSync(OUT_IMG, { recursive: true });

// Todas las imágenes de proyecto (sin el logo)
const projects = [
  'techo', 'techo2', 'Techo3', 'techo4', 'techo5', 'techo6', 'techo7', 'techo8',
  'puerta', 'puerta2', 'puerta3',
  'ventana', 'ventana2', 'ventana3'
];

// Imágenes de fondo / rol específico: fuente -> nombre destino, ancho, calidad
const heroes = [
  { src: 'Techo3', out: 'hero', w: 1600, q: 82, enlarge: true },
  { src: 'techo4', out: 'about', w: 1100, q: 84, enlarge: true },
  { src: 'techo8', out: 'whyus', w: 1700, q: 78, enlarge: true },
  { src: 'techo5', out: 'cta', w: 1700, q: 78, enlarge: true },
  { src: 'techo6', out: 'about2', w: 900, q: 84, enlarge: true }
];

async function run() {
  // 1) Galería: full (lightbox) + thumb (tarjeta)
  for (const name of projects) {
    const input = path.join(SRC, name + '.png');
    if (!fs.existsSync(input)) { console.warn('NO existe', input); continue; }
    const lower = name.toLowerCase();

    await sharp(input)
      .resize({ width: 1400, withoutEnlargement: true })
      .webp({ quality: 86 })
      .toFile(path.join(OUT_PROJ, lower + '.webp'));

    await sharp(input)
      .resize({ width: 800, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(path.join(OUT_PROJ, lower + '-thumb.webp'));

    console.log('proyecto OK ->', lower);
  }

  // 2) Fondos de sección
  for (const h of heroes) {
    const input = path.join(SRC, h.src + '.png');
    if (!fs.existsSync(input)) { console.warn('NO existe', input); continue; }
    await sharp(input)
      .resize({ width: h.w, withoutEnlargement: !h.enlarge })
      .webp({ quality: h.q })
      .toFile(path.join(OUT_IMG, h.out + '.webp'));
    console.log('fondo OK ->', h.out);
  }

  // 3) Reporte de tamaños
  const list = [...fs.readdirSync(OUT_PROJ).map(f => ['projects', f]),
                ...fs.readdirSync(OUT_IMG).map(f => ['img', f])];
  let total = 0;
  for (const [dir, f] of list) {
    const s = fs.statSync(path.join(__dirname, 'assets', dir, f)).size;
    total += s;
  }
  console.log(`\nArchivos WebP: ${list.length}  |  Peso total: ${(total/1024/1024).toFixed(2)} MB`);
}

run().catch(e => { console.error(e); process.exit(1); });
