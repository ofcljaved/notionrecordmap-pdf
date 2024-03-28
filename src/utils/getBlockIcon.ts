import { Block, ExtendedRecordMap, PageBlock } from '../types';
import { getBlockCollectionId } from './getBlockCollectionId';

export function getBlockIcon(block: Block, recordMap: ExtendedRecordMap) {
  if ((block as PageBlock).format?.page_icon) {
    return (block as PageBlock).format?.page_icon;
  }

  if (
    block.type === 'collection_view_page' ||
    block.type === 'collection_view'
  ) {
    const collectionId = getBlockCollectionId(block, recordMap);
    if (collectionId) {
      const collection = recordMap.collection[collectionId]?.value;

      if (collection) {
        return collection.icon;
      }
    }
  }

  return null;
}
