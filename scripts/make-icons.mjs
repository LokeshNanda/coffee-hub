// Renders the PWA icons (a coffee bean on an espresso-brown tile) to PNG with no dependencies.
// Run: node scripts/make-icons.mjs
import { deflateSync } from 'node:zlib';
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const out = join(dirname(fileURLToPath(import.meta.url)), '..', 'public');
mkdirSync(out, { recursive: true });

const BG = [0x22, 0x16, 0x11];
const BEAN = [0xd9, 0xa6, 0x6b];

function render(size, { padding, rounded }) {
  const px = new Uint8Array(size * size * 4);
  const cx = size / 2;
  const cy = size / 2;
  const rx = size * 0.22;
  const ry = size * 0.32;
  const ang = (-25 * Math.PI) / 180;
  const cosA = Math.cos(ang);
  const sinA = Math.sin(ang);
  const radius = rounded ? size * 0.22 : 0;
  const slit = size * 0.045;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4;
      // Rounded tile mask.
      let inTile = true;
      if (radius) {
        const dx = Math.max(radius - x, 0, x - (size - 1 - radius));
        const dy = Math.max(radius - y, 0, y - (size - 1 - radius));
        inTile = dx * dx + dy * dy <= radius * radius;
      }
      if (!inTile) continue;
      let c = BG;
      // Bean: rotated ellipse with a curved slit, shrunk by padding for maskable safe zone.
      const scale = 1 - padding;
      const ux = ((x - cx) * cosA + (y - cy) * sinA) / scale;
      const uy = (-(x - cx) * sinA + (y - cy) * cosA) / scale;
      const inBean = (ux * ux) / (rx * rx) + (uy * uy) / (ry * ry) <= 1;
      if (inBean) {
        const curve = ux - Math.sin((uy / ry) * Math.PI) * rx * 0.35;
        c = Math.abs(curve) < slit ? BG : BEAN;
      }
      px[i] = c[0];
      px[i + 1] = c[1];
      px[i + 2] = c[2];
      px[i + 3] = 255;
    }
  }
  return px;
}

function crc32(buf) {
  let c;
  const table = [];
  for (let n = 0; n < 256; n++) {
    c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c >>> 0;
  }
  let crc = 0xffffffff;
  for (const b of buf) crc = table[(crc ^ b) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(type), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(td));
  return Buffer.concat([len, td, crc]);
}

function png(size, px) {
  const raw = Buffer.alloc((size * 4 + 1) * size);
  for (let y = 0; y < size; y++) {
    raw[y * (size * 4 + 1)] = 0;
    Buffer.from(px.buffer, y * size * 4, size * 4).copy(raw, y * (size * 4 + 1) + 1);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw)),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

const files = [
  ['pwa-192.png', 192, { padding: 0.1, rounded: false }],
  ['pwa-512.png', 512, { padding: 0.1, rounded: false }],
  ['apple-touch-icon.png', 180, { padding: 0.05, rounded: false }],
];
for (const [name, size, opts] of files) {
  writeFileSync(join(out, name), png(size, render(size, opts)));
  console.log('wrote', name);
}
