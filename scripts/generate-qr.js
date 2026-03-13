const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');
const sharp = require('sharp');

async function main() {
  // URL that guests will open when scanning
  const targetUrl = 'https://beitnaa.vercel.app';

  // Output directory and file
  const outDir = path.join(process.cwd(), 'qr-output');
  const qrPath = path.join(outDir, 'beitna-qr.png');

  // Ensure output directory exists
  fs.mkdirSync(outDir, { recursive: true });

  console.log('Generating QR for:', targetUrl);

  // Create high‑resolution base QR with custom colors
  const qrBuffer = await QRCode.toBuffer(targetUrl, {
    errorCorrectionLevel: 'H', // leaves room for logo in the middle
    margin: 3,
    scale: 22, // high resolution for print
    color: {
      dark: '#5C7F67', // Beitna primary (olive green)
      light: '#FFF7EB', // warm cream background
    },
  });

  const logoPath = path.join(process.cwd(), 'public', 'logo.png');
  if (!fs.existsSync(logoPath)) {
    console.warn('Warning: public/logo.png not found. Generating QR without logo.');
    fs.writeFileSync(qrPath, qrBuffer);
    console.log('QR saved at:', qrPath);
    return;
  }

  // Prepare logo on a rounded tile with subtle glow.
  // Tile size is smaller than the QR (≈ 25%) to avoid composite errors.
  const logoTileSize = 220;
  const logoTileBackground = await sharp({
    create: {
      width: logoTileSize,
      height: logoTileSize,
      channels: 4,
      // black tile so golden logo pops
      background: { r: 0, g: 0, b: 0, alpha: 1 },
    },
  })
    .png()
    .composite([
      {
        input: Buffer.from(
          `<svg width="${logoTileSize}" height="${logoTileSize}" viewBox="0 0 ${logoTileSize} ${logoTileSize}" xmlns="http://www.w3.org/2000/svg">
            <rect x="4" y="4" width="${logoTileSize - 8}" height="${logoTileSize - 8}" rx="${(logoTileSize - 8) / 4}" ry="${(logoTileSize - 8) / 4}"
              fill="url(#g)" stroke="#5C7F67" stroke-width="3" fill-opacity="0.08" />
            <defs>
              <radialGradient id="g" cx="50%" cy="30%" r="80%">
                <stop offset="0%" stop-color="#F4C095" stop-opacity="0.25"/>
                <stop offset="50%" stop-color="#5C7F67" stop-opacity="0.12"/>
                <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
              </radialGradient>
            </defs>
          </svg>`
        ),
        top: 0,
        left: 0,
      },
    ])
    .png()
    .toBuffer();

  // Resize logo to comfortably fit inside the tile
  const resizedLogo = await sharp(logoPath)
    .resize(Math.floor(logoTileSize * 0.7), Math.floor(logoTileSize * 0.7), {
      fit: 'inside',
    })
    .png()
    .toBuffer();

  const logoTile = await sharp(logoTileBackground)
    .composite([
      {
        input: resizedLogo,
        gravity: 'center',
      },
    ])
    .png()
    .toBuffer();

  // Composite logo tile in the center of the QR
  const qrWithLogo = await sharp(qrBuffer)
    .composite([
      {
        input: logoTile,
        gravity: 'center',
      },
    ])
    .png()
    .toBuffer();

  // Place QR on a premium card background with rounded corners and outer border
  const cardPadding = 80;
  const qrMeta = await sharp(qrWithLogo).metadata();
  const cardWidth = (qrMeta.width || 1000) + cardPadding * 2;
  const cardHeight = (qrMeta.height || 1000) + cardPadding * 2;

  const card = await sharp({
    create: {
      width: cardWidth,
      height: cardHeight,
      channels: 4,
      background: { r: 18, g: 26, b: 22, alpha: 1 },
    },
  })
    .png()
    .composite([
      // outer border with slight gradient
      {
        input: Buffer.from(
          `<svg width="${cardWidth}" height="${cardHeight}" viewBox="0 0 ${cardWidth} ${cardHeight}" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="border" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#F4C095"/>
                <stop offset="50%" stop-color="#5C7F67"/>
                <stop offset="100%" stop-color="#3D5A40"/>
              </linearGradient>
            </defs>
            <rect x="8" y="8" width="${cardWidth - 16}" height="${cardHeight - 16}" rx="36" ry="36"
              fill="none" stroke="url(#border)" stroke-width="3"/>
          </svg>`
        ),
        top: 0,
        left: 0,
      },
      // QR centered
      {
        input: qrWithLogo,
        gravity: 'center',
      },
    ])
    .png()
    .toBuffer();

  fs.writeFileSync(qrPath, card);
  console.log('Premium QR card saved at:', qrPath);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

