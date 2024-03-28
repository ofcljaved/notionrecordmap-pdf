import fs from 'fs/promises';
import { renderer } from './renderer';

(async function getContent() {
  try {
    const rawData = await fs.readFile(
      './src/assets/recordmap.org.json',
      'utf-8'
    );
    const data = JSON.parse(rawData);
    const javed = renderer({ recordMap: data, fullPage: true, darkMode: true });
    const formatted = javed?.replace(/\s*(<[^>]+>)\s*/g, '$1');

    console.log(formatted);
  } catch (error) {
    console.log('--------Shit happens\n', error);
  }
})();
