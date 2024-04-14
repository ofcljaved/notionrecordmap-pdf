import { fileChildrenTemplate, fileTemplate } from './handlebars/file';
import { renderText } from './renderText';
import { ExtendedRecordMap, FileBlock } from './types';

interface RenderFileProps {
  block: FileBlock;
  blockId: string;
  recordMap: ExtendedRecordMap;
}
export function renderFile({ block, blockId, recordMap }: RenderFileProps) {
  const source =
    recordMap.signed_urls[block.id] || block.properties?.source?.[0]?.[0];

  const children = block.properties?.size
    ? fileChildrenTemplate({
        text: renderText({ value: block.properties.size, block, recordMap }),
      })
    : '';

  return fileTemplate({
    blockId,
    source,
    children,
    text: renderText({
      value: block.properties.title || [['File']],
      block,
      recordMap,
    }),
  });
}
