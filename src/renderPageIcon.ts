import {
  iconTemplate,
  nonIconTemplate,
  pageIconTemplate,
} from './handlebars/pageIcon';
import { Block, CalloutBlock, ExtendedRecordMap, PageBlock } from './types';
import { getBlockIcon } from './utils/getBlockIcon';
import { getBlockTitle } from './utils/getBlockTitle';
import isUrl from './utils/isUrl';
import { mapImageUrl } from './utils/mapImageUrl';

interface RendererPageIconProps {
  block: Block;
  defaultIcon: string | null;
  inline?: boolean;
  recordMap: ExtendedRecordMap;
  darkMode?: boolean;
  className?: string;
}

const isIconBlock = (value: Block): value is PageBlock | CalloutBlock => {
  return (
    value.type === 'page' ||
    value.type === 'callout' ||
    value.type === 'collection_view' ||
    value.type === 'collection_view_page'
  );
};

export function rendererPageIcon({
  block,
  defaultIcon,
  inline = true,
  recordMap,
  darkMode,
  className,
}: RendererPageIconProps) {
  let isImage = false;
  let content: any = null;

  if (isIconBlock(block)) {
    const icon = getBlockIcon(block, recordMap)?.trim() || defaultIcon;
    const title = getBlockTitle(block, recordMap);

    if (icon && isUrl(icon)) {
      const url = mapImageUrl(icon, block);
      isImage = true;

      content = iconTemplate({ url, title: title || 'page icon', className });
    } else if (icon && icon.startsWith('/icons/')) {
      const url =
        'https://www.notion.so' +
        icon +
        '?mode=' +
        (darkMode ? 'dark' : 'light');

      content = iconTemplate({ url, title: title || 'page icon', className });
    } else if (!icon) {
      isImage = false;
      content = nonIconTemplate({ className, icon });
    }
  }

  if (!content) {
    return null;
  }

  return pageIconTemplate({
    className,
    content,
    inline: inline ? 'notion-page-icon-inline' : 'notion-page-icon-hero',
    isImage: isImage ? 'notion-page-icon-image' : 'notion-page-icon-span',
  });
}
