import { BlockMap } from '../types';

export const groupBlockContent = (blockMap: BlockMap): string[][] => {
  const output: string[][] = [];

  let lastType: string | undefined = undefined;
  let index = -1;

  Object.keys(blockMap).forEach(id => {
    const blockValue = blockMap[id]?.value;

    if (blockValue) {
      blockValue.content?.forEach(blockId => {
        const blockType = blockMap[blockId]?.value?.type;

        if (blockType && blockType !== lastType) {
          index++;
          lastType = blockType;
          output[index] = [];
        }

        if (index > -1) {
          output[index].push(blockId);
        }
      });
    }

    lastType = undefined;
  });

  return output;
};
