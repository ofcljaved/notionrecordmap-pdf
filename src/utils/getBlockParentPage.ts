import { Block, Collection, ExtendedRecordMap, PageBlock } from '../types';

export const getBlockParentPage = (
  block: Block,
  recordMap: ExtendedRecordMap,
  {
    inclusive = false,
  }: {
    inclusive?: boolean;
  } = {}
): PageBlock | null => {
  let currentRecord: Block | Collection = block;

  while (currentRecord != null) {
    if (inclusive && (currentRecord as Block)?.type === 'page') {
      return currentRecord as PageBlock;
    }

    const parentId: string = currentRecord.parent_id;
    const parentTable = currentRecord.parent_table;

    if (!parentId) {
      break;
    }

    if (parentTable === 'collection') {
      currentRecord = recordMap.collection[parentId]?.value;
    } else {
      currentRecord = recordMap.block[parentId]?.value;

      if ((currentRecord as Block)?.type === 'page') {
        return currentRecord as PageBlock;
      }
    }
  }

  return null;
};
