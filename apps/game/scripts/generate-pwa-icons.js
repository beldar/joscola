// Script to generate PWA icons using Canvas API in Node.js
const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

const sizes = [16, 32, 72, 96, 128, 144, 152, 192, 384, 512];

// Create public directory if it doesn't exist
const publicDir = path.join(__dirname, '..', 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir);
}

function generateIcon(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // Gradient background
  const gradient = ctx.createLinearGradient(0, 0, size, size);
  gradient.addColorStop(0, '#3b82f6');
  gradient.addColorStop(0.5, '#8b5cf6');
  gradient.addColorStop(1, '#ec4899');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  // White circle background
  ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size * 0.35, 0, Math.PI * 2);
  ctx.fill();

  // Draw "J" letter
  ctx.fillStyle = '#3b82f6';
  ctx.font = `bold ${size * 0.5}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('J', size / 2, size / 2);

  // Save the image
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(publicDir, `icon-${size}x${size}.png`), buffer);
  console.log(`Generated icon-${size}x${size}.png`);
}

// Generate screenshots
function generateScreenshot(width, height, name) {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Gradient background
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, '#dbeafe');
  gradient.addColorStop(0.5, '#e9d5ff');
  gradient.addColorStop(1, '#fce7f3');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // Add text
  ctx.fillStyle = '#1f2937';
  ctx.font = `bold ${width / 10}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('Joscola', width / 2, height / 2 - 50);

  ctx.font = `${width / 20}px sans-serif`;
  ctx.fillText('Educational Games for Kids', width / 2, height / 2 + 30);

  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(publicDir, name), buffer);
  console.log(`Generated ${name}`);
}

console.log('Generating PWA icons...');

// Generate all icon sizes
sizes.forEach(size => generateIcon(size));

// Generate screenshots
generateScreenshot(1280, 720, 'screenshot-wide.png');
generateScreenshot(720, 1280, 'screenshot-narrow.png');

console.log('All icons generated successfully!');