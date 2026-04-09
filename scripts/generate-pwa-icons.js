const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const INPUT_LOGO = path.join(__dirname, '../public/pwa-logo.png');
const PUBLIC_DIR = path.join(__dirname, '../public');

async function generateIcons() {
  console.log('🚀 Generating PWA icons...');
  
  if (!fs.existsSync(INPUT_LOGO)) {
    console.error('❌ logo.png not found in public/ directory');
    process.exit(1);
  }

  try {
    // 192x192 manifest icon
    await sharp(INPUT_LOGO)
      .resize(192, 192)
      .toFile(path.join(PUBLIC_DIR, 'icon-192.png'));
    console.log('✅ icon-192.png created');

    // 512x512 manifest icon
    await sharp(INPUT_LOGO)
      .resize(512, 512)
      .toFile(path.join(PUBLIC_DIR, 'icon-512.png'));
    console.log('✅ icon-512.png created');

    // 180x180 Apple touch icon (Standard name)
    await sharp(INPUT_LOGO)
      .resize(180, 180)
      .toFile(path.join(PUBLIC_DIR, 'apple-touch-icon.png'));
    console.log('✅ apple-touch-icon.png created');

    // favicon.ico (32x32 for standard use)
    await sharp(INPUT_LOGO)
      .resize(32, 32)
      .toFile(path.join(PUBLIC_DIR, 'favicon.ico'));
    console.log('✅ favicon.ico created');

    console.log('✨ All PWA icons generated successfully!');
  } catch (error) {
    console.error('❌ Error generating icons:', error);
  }
}

generateIcons();
