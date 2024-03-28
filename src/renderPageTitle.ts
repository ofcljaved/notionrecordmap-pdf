import { rendererPageIcon } from './renderPageIcon';
import { Block, ExtendedRecordMap } from './types';
import { getBlockTitle } from './utils/getBlockTitle';

interface RenderPageTitleProps {
  block: Block;
  recordMap: ExtendedRecordMap;
  className?: string;
}

export function renderPageTitle({
  block,
  recordMap,
  className,
}: RenderPageTitleProps) {
  if (!block) return null;

  if (
    block.type === 'collection_view_page' ||
    block.type === 'collection_view'
  ) {
    const title = getBlockTitle(block, recordMap);
    if (!title) {
      return null;
    }

    return `
      <span class='${className} notion-page-title'>
        ${rendererPageIcon({ block, recordMap, defaultIcon: null, className: 'notion-page-title-icon' })}
        <span class='notion-page-title-text'>
          <Text value={titleDecoration} block={block} /> //TODO:
        </span>
      </span>`;
  }
  if (!block.properties?.title) return null;

  return `
    <span class='${className} notion-page-title'>
      ${rendererPageIcon({ block, recordMap, defaultIcon: null, className: 'notion-page-title-icon' })}
      <span class='notion-page-title-text'>
        <Text value={block.properties?.title} block={block} /> //TODO:
      </span>
    </span>
    `;
}
