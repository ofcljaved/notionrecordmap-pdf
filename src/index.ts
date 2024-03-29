import fs from 'fs/promises';
import { renderer } from './renderer';
import puppeteer from 'puppeteer';

(async function getContent() {
  try {
    const rawData = await fs.readFile(
      './src/assets/recordmap.org.json',
      'utf-8'
    );
    const data = JSON.parse(rawData);
    const javed = renderer({ recordMap: data, fullPage: true, darkMode: true });
    const formatted = javed?.replace(/\s*(<[^>]+>)\s*/g, '$1');
    const style = await fs.readFile('./src/style.css', { encoding: 'utf-8' });
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<body class="notion-app dark-mode">
  <style>
    ${style};
  </style>
  ${formatted}
</body>
</html>
`;

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setContent(htmlContent);

    await page.pdf({
      path: 'example.pdf',
      format: 'A4',
      margin: { top: 0 },
      printBackground: true,
    });
    await browser.close();
  } catch (error) {
    console.log('--------Shit happens\n', error);
  }
})();
