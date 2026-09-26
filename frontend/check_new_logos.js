import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const logo1 = 'D:\\Placement Scenario\\Logo\\ChatGPT Image Sep 25, 2026, 09_01_40 PM.png';
const logo2 = 'D:\\Placement Scenario\\Logo\\ChatGPT Image Sep 25, 2026, 09_01_48 PM.png';

async function check() {
  const meta1 = await sharp(logo1).metadata();
  const meta2 = await sharp(logo2).metadata();

  console.log('Logo 1 (09_01_40 PM):', meta1.width, 'x', meta1.height, meta1.format);
  console.log('Logo 2 (09_01_48 PM):', meta2.width, 'x', meta2.height, meta2.format);
}

check();
