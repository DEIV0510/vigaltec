// Procesa el LOGO.png real: versión blanca (fondos oscuros) y color (fondo transparente)
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const SRC = 'C:\\Users\\Lenovo\\Desktop\\VIGALTEC\\LOGO.png';
const OUT = path.join(__dirname, 'assets', 'logo');
fs.mkdirSync(OUT, { recursive: true });

async function run() {
  // 1) Recortar el original a su bounding box real (quita márgenes blancos).
  //    Se hace sobre la imagen en color porque el blanco SÍ difiere del logo oscuro.
  const trimmed = await sharp(SRC).flatten({ background: '#ffffff' }).trim({ threshold: 12 }).toBuffer();
  const m = await sharp(trimmed).metadata();

  // 2) Máscara de opacidad desde el recorte: logo (oscuro) -> opaco, blanco -> transparente.
  const alpha = await sharp(trimmed)
    .grayscale()
    .negate()
    .linear(4, -120)          // pendiente fuerte: logo sólido, fondo a cero
    .toColourspace('b-w')
    .png()
    .toBuffer();

  // 3) BLANCO sobre transparente (header, footer, loader) — dos pasadas para conservar proporción
  const whiteFull = await sharp({ create: { width: m.width, height: m.height, channels: 3, background: '#ffffff' } })
    .joinChannel(alpha).png().toBuffer();
  await sharp(whiteFull).resize({ width: 760 }).png().toFile(path.join(OUT, 'logo-white.png'));

  // 4) COLOR original sobre transparente (para fondos claros)
  const colorFull = await sharp(trimmed).joinChannel(alpha).png().toBuffer();
  await sharp(colorFull).resize({ width: 760 }).png().toFile(path.join(OUT, 'logo-color.png'));

  // 5) Vista previa del blanco sobre fondo oscuro (solo para verificar)
  const whiteBuf = await sharp({ create: { width: m.width, height: m.height, channels: 3, background: '#ffffff' } })
    .joinChannel(alpha).png().toBuffer();
  await sharp(whiteBuf)
    .flatten({ background: '#111111' })
    .resize({ width: 760 })
    .png()
    .toFile(path.join(OUT, '_preview-white-on-dark.png'));

  console.log('recorte original ->', m.width + 'x' + m.height, '(ratio ' + (m.width / m.height).toFixed(2) + ')');
  for (const f of ['logo-white.png', 'logo-color.png']) {
    const mm = await sharp(path.join(OUT, f)).metadata();
    console.log(f, '->', mm.width + 'x' + mm.height);
  }
}
run().catch(e => { console.error(e); process.exit(1); });
