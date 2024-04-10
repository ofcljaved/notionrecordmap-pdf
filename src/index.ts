import fs from 'fs/promises';
import { renderer } from './renderer';
import puppeteer from 'puppeteer';
import Handlebars from 'handlebars';

// import express from 'express';

// const app = express();

// app.get('/', (_, res) => {
//   res.send('WORKING JUST FINE');
// });

// app.get('/pdf', async (_, res) => {
//   try {
//     const rawData = await fs.readFile(
//       './src/assets/recordmap.org.json',
//       'utf-8'
//     );
//     const data = JSON.parse(rawData);
//     const javed = renderer({ recordMap: data, fullPage: true, darkMode: true });
//     const formatted = javed?.replace(/\s*(<[^>]+>)\s*/g, '$1');
//     const style = await fs.readFile('./src/style.css', { encoding: 'utf-8' });
//     const htmlContent = `
// <!DOCTYPE html>
// <html lang="en">
// <body class="notion-app dark-mode">
//   <style>
//     ${style};
//   </style>
//   ${formatted}
// </body>
// </html>
// `;
//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();

//     await page.setContent(htmlContent);

//     const pdf = await page.pdf({
//       format: 'A4',
//       printBackground: true,
//     });
//     await browser.close();
//     res.setHeader('Content-Type', 'application/pdf');
//     res.send(pdf);
//   } catch (error) {
//     console.log('--------Shit happens\n', error);
//     res.send('ERROR-------');
//   }
// });

// app.listen(8080, () => {
//   console.log('SERVER IS RUNNING ON PORT: 8080');
// });

(async function getContent() {
  try {
    const rawData = await fs.readFile(
      './src/assets/recordmap.org.json',
      'utf-8'
    );
    const data = JSON.parse(rawData);

    console.log(Array.isArray(data));

    let notionPage = '';

    if (Array.isArray(data)) {
      data.forEach(d => {
        notionPage += renderer({
          recordMap: d,
          fullPage: true,
          darkMode: true,
        });
      });
    } else {
      notionPage = renderer({
        recordMap: data,
        fullPage: true,
        darkMode: true,
      });
    }
    const style = await fs.readFile('./src/style.css', { encoding: 'utf-8' });
    const htmlSource = `<!DOCTYPE html>
    <html lang="en">
    <body class="notion-app dark-mode">
      <style>{{style}}</style>
      {{{notionPage}}}
    </body>
    </html>
    `;
    const htmlTemplate = Handlebars.compile(htmlSource);
    const htmlContent = htmlTemplate({ notionPage, style });

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
