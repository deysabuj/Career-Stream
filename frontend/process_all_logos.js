import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sourceDir = 'D:\\Placement Scenario\\Logo';
const targetDirAssets = path.join(__dirname, 'src', 'assets', 'company-logos');
const targetDirPublic = path.join(__dirname, 'public', 'logos');

// Ensure target directories exist
if (!fs.existsSync(targetDirAssets)) {
  fs.mkdirSync(targetDirAssets, { recursive: true });
}
if (!fs.existsSync(targetDirPublic)) {
  fs.mkdirSync(targetDirPublic, { recursive: true });
}

// Complete mapping table from D:\Placement Scenario\Logo filenames to target alias filenames
const fileMap = {
  'accenture.png': ['accenture.png'],
  'adobe.png': ['adobe.png'],
  'amazon.png': ['amazon.png'],
  'apple.png': ['apple.png'],
  'cisco.png': ['cisco.png'],
  'concentrix.png': ['concentrix.png'],
  'deloitte.png': ['deloitte.png'],
  'ey.png': ['ey.png'],
  'google.png': ['google.png'],
  'hcl.png': ['hcl.png'],
  'hdfc_bank.png': ['hdfc.png', 'hdfc_bank.png', 'hdfc-bank.png'],
  'hsbc.png': ['hsbc.png'],
  'ibm.png': ['ibm.png'],
  'infosys.png': ['infosys.png'],
  'jpmorgan and chase.png': ['jpmorgan.png', 'jpmorgan-chase.png', 'jpmorgan and chase.png'],
  'kpmg.png': ['kpmg.png'],
  'microsoft.png': ['microsoft.png'],
  'pwc (2).png': ['pwc.png', 'pwc (2).png'],
  'tcs.png': ['tcs.png'],
  'zscaler.png': ['zscaler.png'],

  // NEW LOGO MAPPINGS
  'goldman sachs.png': ['goldman-sachs.png', 'goldmansachs.png', 'goldman sachs.png'],
  'razorpay.png': ['razorpay.png'],
  'sun pharma.png': ['sun-pharma.png', 'sunpharma.png', 'sun pharma.png'],
  'apollo hospitals.png': ['apollo-hospitals.png', 'apollo.png', 'apollo hospitals.png'],
  'manipal hospitals.png': ['manipal-hospitals.png', 'manipal.png', 'manipal hospitals.png'],
  'walmart global tech.png': ['walmart-global-tech.png', 'walmart.png', 'walmart global tech.png'],
  'hindustan unilever.png': ['hindustan-unilever.png', 'hul.png', 'hindustan unilever.png'],
  'tata motors.png': ['tata-motors.png', 'tatamotors.png', 'tata motors.png'],
  'relaince jio platforms.png': ['reliance-jio-platforms.png', 'jio.png', 'relaince jio platforms.png'],
  'nvidia.png': ['nvidia.png'],
  'coursera.png': ['coursera.png'],
};

async function processLogos() {
  if (!fs.existsSync(sourceDir)) {
    console.error(`Source directory ${sourceDir} does not exist!`);
    return;
  }

  const files = fs.readdirSync(sourceDir);
  console.log(`Processing logo files from ${sourceDir}...`);

  for (const file of files) {
    const filePath = path.join(sourceDir, file);
    if (fs.statSync(filePath).isDirectory()) continue;

    const targetNames = fileMap[file] || [file.toLowerCase().replace(/\s+/g, '-')];

    try {
      const buffer = fs.readFileSync(filePath);
      
      const trimmedBuffer = await sharp(buffer)
        .trim({ threshold: 15 })
        .extend({
          top: 10,
          bottom: 10,
          left: 12,
          right: 12,
          background: { r: 255, g: 255, b: 255, alpha: 0 }
        })
        .png()
        .toBuffer();

      for (const targetName of targetNames) {
        const outAssets = path.join(targetDirAssets, targetName);
        const outPublic = path.join(targetDirPublic, targetName);
        fs.writeFileSync(outAssets, trimmedBuffer);
        fs.writeFileSync(outPublic, trimmedBuffer);
        console.log(` Saved logo asset: ${targetName}`);
      }
    } catch (err) {
      console.error(` Error processing ${file}:`, err.message);
    }
  }

  console.log(' All logos successfully processed, cropped, and copied to assets & public directories!');
}

processLogos();
