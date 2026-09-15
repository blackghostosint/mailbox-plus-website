import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

try {
  console.log('Ensuring compatible Chrome and ChromeDriver binaries...');
  execSync('npx browser-driver-manager install chrome', { stdio: 'inherit' });

  const envPath = path.join(os.homedir(), '.browser-driver-manager', '.env');
  let chromePath = '';
  let chromedriverPath = '';

  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    for (const line of envContent.split('\n')) {
      const matchChrome = line.match(/^CHROME_TEST_PATH="([^"]+)"$/);
      if (matchChrome) chromePath = matchChrome[1];
      const matchDriver = line.match(/^CHROMEDRIVER_TEST_PATH="([^"]+)"$/);
      if (matchDriver) chromedriverPath = matchDriver[1];
    }
  }

  let extraFlags = '';
  if (chromePath && fs.existsSync(chromePath)) {
    extraFlags += ` --chrome-path "${chromePath}"`;
  }
  if (chromedriverPath && fs.existsSync(chromedriverPath)) {
    extraFlags += ` --chromedriver-path "${chromedriverPath}"`;
  }

  const cmd = `npx axe http://localhost:4321 http://localhost:4321/accessibility/ http://localhost:4321/contact-us/ --exit --tags wcag2a,wcag2aa,wcag21a,wcag21aa${extraFlags}`;
  console.log(`Executing: ${cmd}`);
  execSync(cmd, { stdio: 'inherit' });
} catch (error) {
  process.exit(error.status || 1);
}
