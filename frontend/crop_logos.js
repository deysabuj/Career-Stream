import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logosDir = path.join(__dirname, 'public', 'logos');

async function processLogos() {
  const files = fs.readdirSync(logosDir);
  console.log(`Found ${files.length} files in ${logosDir}`);

  for (const file of files) {
    if (file.endsWith('.md')) continue;

    const filePath = path.join(logosDir, file);
    try {
      const buffer = await fs.promises.readFile(filePath);
      
      const trimmedBuffer = await sharp(buffer)
        .trim({ threshold: 15 })
        .extend({
          top: 12,
          bottom: 12,
          left: 16,
          right: 16,
          background: { r: 255, g: 255, b: 255, alpha: 1 }
        })
        .png()
        .toBuffer();

      await fs.promises.writeFile(filePath, trimmedBuffer);
      console.log(` Trimmed and cropped logo whitespace: ${file}`);
    } catch (err) {
      console.error(` Error processing ${file}:`, err.message);
    }
  }

  console.log(' All logos successfully cropped and centered!');
}

processLogos();
