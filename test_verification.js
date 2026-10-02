import fs from 'fs';
import path from 'path';

const root = 'c:\\Users\\Asus\\Downloads\\book';

console.log('=== UI/UX & Jewelry Verification ===\n');

// 1. Scene configuration
const sceneContent = fs.readFileSync(path.join(root, 'src', 'Scene.tsx'), 'utf8');
const sceneOk = sceneContent.includes('primaryColor="#c3a47b"');
console.log(`[${sceneOk ? 'PASS' : 'FAIL'}] Scene.tsx primaryColor="#c3a47b" (original UI/UX palette)`);

// 2. HTML verification
const htmlPath = path.join(root, 'public', 'landing-pages', 'bestsellers-book-showcase.html');
const html = fs.readFileSync(htmlPath, 'utf8');

const checks = [
  { name: 'Original embedded base64 MP4 videos present', pass: html.includes('data:video/mp4;base64,') },
  { name: 'Original embedded base64 JPEG cover images present', pass: html.includes('data:image/jpeg;base64,') },
  { name: 'Original cherry blossom field and petals present', pass: html.includes('class="blossom-field"') && html.includes('class="blossom"') },
  { name: 'Cover 1 name replaced with jewelry: Solitaire', pass: html.includes('Solitaire</span>') && html.includes('Diamond Ring Collection</span>') },
  { name: 'Cover 2 name replaced with jewelry: Emeralds & Gems', pass: html.includes('Emeralds<br>& Gems</span>') && html.includes('Imperial High Jewelry</span>') },
  { name: 'Cover 3 name replaced with jewelry: Celestial Pearls', pass: html.includes('Celestial</span>') && html.includes('Pearls & Diamond Pendants</span>') },
  { name: 'Book 1 click information: The Royal Solitaire', pass: html.includes('title: "The Royal Solitaire"') && html.includes('Micro-Pavé Setting') },
  { name: 'Book 2 click information: Imperial Emeralds & Sapphires', pass: html.includes('title: "Imperial Emeralds & Sapphires"') && html.includes('Colombian Muzo emeralds') },
  { name: 'Book 3 click information: Celestial Pearls & Diamonds', pass: html.includes('title: "Celestial Pearls & Diamonds"') && html.includes('South Sea Keshi pearls') },
  { name: 'Interactive handlers intact (selectBook, closeDetail, updateParallax)', pass: html.includes('selectBook') && html.includes('closeDetail') && html.includes('updateParallax') }
];

for (const c of checks) {
  console.log(`[${c.pass ? 'PASS' : 'FAIL'}] ${c.name}`);
}

// 3. Live HTTP Endpoints Verification on Port 8080
console.log('\n=== Live Endpoints Verification (Port 8080) ===');
try {
  const rootRes = await fetch('http://localhost:8080/');
  console.log(`[${rootRes.ok ? 'PASS' : 'FAIL'}] Root http://localhost:8080/ status: ${rootRes.status}`);

  const htmlRes = await fetch('http://localhost:8080/landing-pages/bestsellers-book-showcase.html');
  const htmlText = await htmlRes.text();
  console.log(`[${htmlRes.ok ? 'PASS' : 'FAIL'}] Canonical HTML status: ${htmlRes.status}, length: ${htmlText.length}`);
} catch (e) {
  console.error('Fetch error:', e.message);
}
