import fs from 'fs/promises';
import path from 'path';
import { renderer } from './renderer';
import puppeteer from 'puppeteer';
import Handlebars from 'handlebars';
import { ExtendedRecordMap } from './types';

// (async function getContent() {
//   // console.log(path.join(__dirname, 'style.css'));

//   try {
//     const rawData = await fs.readFile(
//       path.join(__dirname, 'assets', 'recordmap.org.json'),
//       { encoding: 'utf-8' }
//     );
//     const data = JSON.parse(rawData);

//     let notionPage = '';

//     data.forEach((d: any) => {
//       notionPage += renderer({
//         recordMap: d,
//         fullPage: true,
//         darkMode: true,
//       });
//     });
//     const cssPath = path.join(__dirname, 'style.css');
//     const style = await fs.readFile(cssPath, { encoding: 'utf-8' });
//     const htmlSource = `<!DOCTYPE html>
//     <html lang="en">
//     <body class="notion-app dark-mode">
//       <style>{{style}}</style>
//       {{{notionPage}}}
//     </body>
//     </html>
//     `;
//     const htmlTemplate = Handlebars.compile(htmlSource);
//     const htmlContent = htmlTemplate({ notionPage, style });
//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();

//     await page.setContent(htmlContent);

//     await page.pdf({
//       path: 'example.pdf',
//       format: 'A4',
//       margin: { top: 0 },
//       printBackground: true,
//     });
//     await browser.close();
//   } catch (error) {
//     console.log('--------Shit happens\n', error);
//   }
// })();

async function renderContent({
  data,
  fullPage,
  darkMode,
}: {
  data: ExtendedRecordMap[];
  fullPage: boolean;
  darkMode: boolean;
}) {
  try {
    let notionPage = '';
    data.forEach(d => {
      notionPage += renderer({
        recordMap: d,
        fullPage,
        darkMode,
      });
    });
    const cssPath = path.join(__dirname, 'style.css');
    const style = await fs.readFile(cssPath, { encoding: 'utf-8' });
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
    return htmlContent;
  } catch (error) {
    return '';
  }
}

export async function generatePdf(props: {
  data: ExtendedRecordMap[];
  fullPage: boolean;
  darkMode: boolean;
}) {
  try {
    const htmlContent = await renderContent(props);
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setContent(htmlContent);

    const pdf = await page.pdf({
      format: 'A4',
      margin: { top: 0 },
      printBackground: true,
    });
    await browser.close();
    return pdf;
  } catch (error) {
    return null;
  }
}
