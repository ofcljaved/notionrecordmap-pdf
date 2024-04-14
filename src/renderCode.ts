import { codeCaptionTemplate, codeTemplate } from './handlebars/code';
import { renderText } from './renderText';
import { CodeBlock, ExtendedRecordMap } from './types';
import { getBlockTitle } from './utils/getBlockTitle';
import Prism from 'prismjs';

interface RenderCodeProps {
  block: CodeBlock;
  blockId: string;
  recordMap: ExtendedRecordMap;
}
export function renderCode({ block, blockId, recordMap }: RenderCodeProps) {
  const language = block.properties?.language?.[0]?.[0]?.toLowerCase();
  const caption = block.properties.caption;
  const content = getBlockTitle(block, recordMap);
  const highlightedContent = Prism.highlight(
    content,
    Prism.languages[language],
    language
  );

  const codeCaption = caption
    ? codeCaptionTemplate({
        renderText: renderText({ value: caption, block, recordMap }),
      })
    : '';
  return codeTemplate({
    blockId,
    language,
    content: highlightedContent,
    codeCaption,
  });
}
