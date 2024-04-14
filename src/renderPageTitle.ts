import { pageTitleTemplate } from './handlebars/pageTitle';
import { rendererPageIcon } from './renderPageIcon';
import { renderText } from './renderText';
import { Block, Decoration, ExtendedRecordMap } from './types';
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
}: RenderPageTitleProps): string {
  if (!block) return '';

  if (
    block.type === 'collection_view_page' ||
    block.type === 'collection_view'
  ) {
    const title = getBlockTitle(block, recordMap);
    if (!title) {
      return '';
    }

    const titleDecoration: Decoration[] = [[title]];

    return pageTitleTemplate({
      className,
      pageIcon: rendererPageIcon({
        block,
        recordMap,
        defaultIcon: null,
        className: 'notion-page-title-icon',
      }),
      renderText: renderText({ value: titleDecoration, block, recordMap }),
    });
  }
  if (!block.properties?.title) return '';

  return pageTitleTemplate({
    className,
    pageIcon: rendererPageIcon({
      block,
      recordMap,
      defaultIcon: null,
      className: 'notion-page-title-icon',
    }),
    renderText: renderText({
      value: block.properties?.title,
      block,
      recordMap,
    }),
  });
}
