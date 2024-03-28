import { Block, ExtendedRecordMap } from '../types';
import { getBlockCollectionId } from './getBlockCollectionId';
import { getTextContent } from './getTextContent';

export function getBlockTitle(block: Block, recordMap: ExtendedRecordMap) {
  if (block.properties?.title) {
    return getTextContent(block.properties.title);
  }

  if (
    block.type === 'collection_view_page' ||
    block.type === 'collection_view'
  ) {
    const collectionId = getBlockCollectionId(block, recordMap);

    if (collectionId) {
      const collection = recordMap.collection[collectionId]?.value;

      if (collection) {
        return getTextContent(collection.name);
      }
    }
  }

  return '';
}
