import fs from 'fs/promises';

(async function getContent() {
  try {
    const rawData = await fs.readFile(
      './src/assets/recordmap.org.json',
      'utf-8'
    );
    const data = JSON.parse(rawData);
    const blockData = Object.values(data.block);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const content = blockData.map((block: any) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const main: any = {};
      main.id = block.value.id;
      main.type = block.value.type;
      main.properties = block.value.properties;
      return main;
    });
    const res = await fs.writeFile(
      './src/assets/content.json',
      JSON.stringify(content),
      'utf-8'
    );
    console.log(res);
  } catch (error) {
    console.log('--------Shit happens\n', error);
  }
})();
