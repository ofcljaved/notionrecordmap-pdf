import { BlockType, ExtendedRecordMap, ID, PageBlock } from '../types';
import { getTextContent } from './getTextContent';

export interface TableOfContentsEntry {
  id: ID;
  type: BlockType;
  text: string;
  indentLevel: number;
}

const indentLevels = {
  header: 0,
  sub_header: 1,
  sub_sub_header: 2,
};

export const getPageTableOfContents = (
  page: PageBlock,
  recordMap: ExtendedRecordMap
): Array<TableOfContentsEntry> => {
  const toc = (page.content ?? [])
    .map((blockId: string) => {
      const block = recordMap.block[blockId]?.value;

      if (block) {
        const { type } = block;

        if (
          type === 'header' ||
          type === 'sub_header' ||
          type === 'sub_sub_header'
        ) {
          return {
            id: blockId,
            type,
            text: getTextContent(block.properties?.title),
            indentLevel: indentLevels[type],
          };
        }
      }

      return null;
    })
    .filter(Boolean) as Array<TableOfContentsEntry>;

  const indentLevelStack = [
    {
      actual: -1,
      effective: -1,
    },
  ];

  for (const tocItem of toc) {
    const { indentLevel } = tocItem;
    const actual = indentLevel;

    do {
      const prevIndent = indentLevelStack[indentLevelStack.length - 1];
      const { actual: prevActual, effective: prevEffective } = prevIndent;

      if (actual > prevActual) {
        tocItem.indentLevel = prevEffective + 1;
        indentLevelStack.push({
          actual,
          effective: tocItem.indentLevel,
        });
      } else if (actual === prevActual) {
        tocItem.indentLevel = prevEffective;
        break;
      } else {
        indentLevelStack.pop();
      }

      // eslint-disable-next-line no-constant-condition
    } while (true);
  }

  return toc;
};
