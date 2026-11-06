const sharp = require('sharp');
const fs = require('node:fs/promises');
const path = require('node:path');
const images = {
  'live-mono': '1a647eec-a2d6-4ecf-9183-79d995efaaf7',
  'portrait-live': '4326e986-0e50-4a25-a567-8f243d7b5cef',
  'portrait-trombone': 'bda2164d-dfd9-4d53-9cba-a64c9910ad7e',
  'bisbal-stage': '0e72a0d8-03f3-4b77-bc8c-0efdc2686c46',
  'bisbal-live': 'cb81c3c2-ac7c-4a86-81af-4349e18f2ded',
  'tangana-live': 'e6f3ca30-c988-4985-be27-f91f17b7a015',
  'tangana-shadows': 'f3caa059-bdc8-42c1-bc2d-5374ffea2d11',
  'portrait-walk': 'c5d1a2ed-8fef-4290-9244-fe89068b90e3',
  'brass-band': 'c48e76e4-3967-42a9-bc9f-551234780c28',
  'tangana-stage': '2f87395d-43aa-4058-8e4f-9d49e6022125'
};
(async () => {
  await fs.mkdir('originals', { recursive: true });
  const manifest = [];
  for (const [name,id] of Object.entries(images)) {
    const original = path.join('originals', name + '.png');
    try { await fs.access(original); } catch {
      await fs.copyFile(path.join(process.env.TEMP, `codex-clipboard-${id}.png`), original);
    }
    const meta = await sharp(original).metadata();
    // No crop, generative reconstruction or upscaling. Preserve the entire frame.
    await sharp(original).rotate().sharpen({ sigma: 0.45, m1: 0.3, m2: 0.8 }).webp({quality:92, effort:6}).toFile(`dist/assets/${name}.webp`);
    await sharp(original).rotate().resize({width:320,withoutEnlargement:true}).webp({quality:88,effort:6}).toFile(`dist/assets/${name}-small.webp`);
    manifest.push({name,width:meta.width,height:meta.height,source:'User-provided photograph; full frame preserved'});
  }
  await fs.writeFile('dist/assets/images.json', JSON.stringify(manifest,null,2));
  console.log(`Prepared ${manifest.length} photographs without cropping or upscaling.`);
})();
