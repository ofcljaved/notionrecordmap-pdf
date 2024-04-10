import {
  aliasTemplate,
  blankTextTemplate,
  bookmarkCoverTemplate,
  bookmarkDescTemplate,
  bookmarkLinkTemplate,
  bookmarkTemplate,
  bookmarkTitleTemplate,
  calloutTemplate,
  codeTemplate,
  collectionTemplate,
  collectionViewPageTemplate,
  columnListTemplate,
  columnTemplate,
  dividerTemplate,
  embedTemplate,
  equationTemplate,
  fullPageTemplate,
  h1Template,
  h2Template,
  h3Template,
  innerHeaderTemplate,
  liTemplate,
  nonFullPageTemplate,
  nonToggleableHeaderTemplate,
  olTemplate,
  pageTemplate,
  quoteTemplate,
  tableTemplate,
  tdTemplate,
  textChildrenTemplate,
  textTemplate,
  tocTemplate,
  todoTemplate,
  toggleTemplate,
  toggleableTemplate,
  trTemplate,
  transclusionTemplate,
  ulTemplate,
} from './handlebars/block';
import { renderAssets } from './renderAsset';
import { renderAudio } from './renderAudio';
import { renderCheckbox } from './renderCheckbox';
import { renderEOI } from './renderEOI';
import { renderFile } from './renderFile';
import { renderGoogledrive } from './renderGoogledrive';
import { rendererPageIcon } from './renderPageIcon';
import { renderPageTitle } from './renderPageTitle';
import { renderSyncpointer } from './renderSycnpointer';
import { renderText } from './renderText';
import { renderer } from './renderer';
import { Block, ExtendedRecordMap, TableBlock } from './types';
import { getBlockCollectionId } from './utils/getBlockCollectionId';
import { getBlockParentPage } from './utils/getBlockParentPage';
import { getListNumber } from './utils/getListNumber';
import { getPageTableOfContents } from './utils/getPageTableOfContents';
import { getTextContent } from './utils/getTextContent';
import isUrl from './utils/isUrl';
import { mapImageUrl } from './utils/mapImageUrl';
import { mapPageUrl } from './utils/mapPageUrl';
import { uuidToId } from './utils/uuidToId';

interface RendererBlockProps {
  level: number;
  block: Block;
  recordMap: ExtendedRecordMap;
  fullPage: boolean;
  darkMode: boolean;
}

const defaultPageIcon: string | null = null;
const tocIndentLevelCache: {
  [blockId: string]: number;
} = {};

export function renderBlock({
  level,
  block,
  ...props
}: RendererBlockProps): string {
  const { recordMap, fullPage, darkMode } = props;
  if (!block) return '';

  if (level === 0 && block.type === 'collection_view') {
    (block as any).type = 'collection_view_page';
  }

  const blockId = `notion-block-${uuidToId(block.id)}`;

  const children =
    block.content
      ?.map(contentBlockId => renderer({ blockId: contentBlockId, ...props }))
      ?.join('') || '';

  switch (block.type) {
    case 'collection_view_page':
    case 'page':
      if (level === 0) {
        const {
          page_icon = defaultPageIcon,
          page_full_width,
          page_small_text,
        } = block.format || {};

        if (fullPage) {
          const properties =
            block.type === 'page'
              ? block.properties
              : {
                  title:
                    recordMap.collection[
                      getBlockCollectionId(block, recordMap) || -1
                    ]?.value?.name,
                };

          const pageIcon =
            recordMap.collection[getBlockCollectionId(block, recordMap) || -1]
              ?.value?.icon ?? defaultPageIcon;
          const isPageIconUrl = pageIcon && isUrl(pageIcon);

          const collectionViewPage =
            block.type !== 'collection_view_page'
              ? collectionViewPageTemplate({ children })
              : '';

          return fullPageTemplate({
            darkMode: darkMode ? 'dark-mode' : 'light-mode',
            blockId,
            pageIcon: page_icon
              ? 'notion-page-has-icon'
              : 'notion-page-no-icon',
            pageIconUrl: isPageIconUrl
              ? 'notion-page-has-image-icon'
              : 'notion-page-has-text-icon',
            fullWidth: page_full_width ? 'notion-full-width' : '',
            smallText: page_small_text ? 'notion-small-text' : '',
            rendererPageIcon: page_icon
              ? rendererPageIcon({
                  block,
                  defaultIcon: defaultPageIcon,
                  inline: false,
                  recordMap,
                  darkMode,
                })
              : '',
            renderText: renderText({
              value: properties?.title || null,
              block,
              recordMap,
            }),
            collectionViewPage,
          });
        } else {
          return nonFullPageTemplate({
            blockId,
            darkMode: darkMode ? 'dark-mode' : 'light-mode',
            fullWidth: page_full_width ? 'notion-full-width' : '',
            smallText: page_small_text ? 'notion-small-text' : '',
            children: block.type !== 'collection_view_page' ? children : '',
          });
        }
      } else {
        const blockColor = block.format?.block_color;

        return pageTemplate({
          blockId,
          blockColor: blockColor ? `notion-${blockColor}` : '',
          url: mapPageUrl(block.id),
          renderPageTitle: renderPageTitle({ block, recordMap }),
        });
      }
    case 'header':
    case 'sub_header':
    case 'sub_sub_header': {
      if (!block.properties) return '';
      const blockColor = block.format?.block_color;
      const id = uuidToId(block.id);
      const title =
        getTextContent(block.properties.title) || `Notion Header ${id}`;
      let indentLevel = tocIndentLevelCache[block.id];
      let indentLevelClass: string = '';

      if (indentLevel === undefined) {
        const page = getBlockParentPage(block, recordMap);

        if (page) {
          const toc = getPageTableOfContents(page, recordMap);
          const tocItem = toc.find(tocItem => tocItem.id === block.id);

          if (tocItem) {
            indentLevel = tocItem.indentLevel;
            tocIndentLevelCache[block.id] = indentLevel;
          }
        }
      }
      if (indentLevel !== undefined) {
        indentLevelClass = `notion-h-indent-${indentLevel}`;
      }
      const isH1 = block.type === 'header';
      const isH2 = block.type === 'sub_header';
      const isH3 = block.type === 'sub_sub_header';

      const classNameStr = `${isH1 ? 'notion-h notion-h1' : ''} ${isH2 ? 'notion-h notion-h2' : ''} ${isH3 ? 'notion-h notion-h3' : ''} ${blockColor ? `notion-${blockColor}` : ''} ${indentLevelClass} ${blockId}`;

      const toggleableHeader = !block.format?.toggleable
        ? nonToggleableHeaderTemplate({ id, title })
        : '';

      const innerHeader = innerHeaderTemplate({
        id,
        toggleableHeader,
        renderText: renderText({
          block,
          recordMap,
          value: block.properties.title,
        }),
      });

      let headerBlock = null;

      if (isH1) {
        headerBlock = h1Template({ classNameStr, id, innerHeader });
      } else if (isH2) {
        headerBlock = h2Template({ classNameStr, id, innerHeader });
      } else {
        headerBlock = h3Template({ classNameStr, id, innerHeader });
      }

      if (block.format?.toggleable) {
        return toggleableTemplate({ blockId, headerBlock, children });
      } else {
        return headerBlock;
      }
    }
    case 'divider': {
      return dividerTemplate({ blockId });
    }
    case 'text': {
      if (!block.properties && !block.content?.length) {
        return blankTextTemplate({ blockId });
      }

      const blockColor = block.format?.block_color;
      const textChildren = children ? textChildrenTemplate({ children }) : '';

      return textTemplate({
        blockColor: blockColor ? `notion-${blockColor}` : '',
        blockId,
        title: block.properties?.title
          ? renderText({ block, recordMap, value: block.properties.title })
          : '',
        children: textChildren,
      });
    }
    case 'bulleted_list':
    case 'numbered_list': {
      const wrapList = (content: string, start?: number) =>
        block.type === 'bulleted_list'
          ? ulTemplate({ blockId, content })
          : olTemplate({ blockId, content, start });
      let output: string = block.properties
        ? liTemplate({
            renderText: renderText({
              block,
              recordMap,
              value: block.properties.title,
            }),
          })
        : '';

      if (block.content) {
        output += wrapList(children);
      }

      const isTopLevel =
        block.type !== recordMap.block[block.parent_id]?.value?.type;
      const start = getListNumber(block.id, recordMap.block);

      return isTopLevel ? wrapList(output, start) : output;
    }
    case 'embed': {
      return embedTemplate({ blockId });
    }
    case 'replit':
    case 'tweet':
    case 'maps':
    case 'pdf':
    case 'figma':
    case 'typeform':
    case 'codepen':
    case 'excalidraw':
    case 'image':
    case 'gist':
    case 'video': {
      return renderAssets({ block, blockId, recordMap });
    }
    case 'drive': {
      return renderGoogledrive({ block, blockId });
    }
    case 'audio': {
      return renderAudio({ block, blockId, recordMap });
    }
    case 'file': {
      return renderFile({ block, blockId, recordMap });
    }
    case 'equation': {
      return equationTemplate({ blockId });
    }
    case 'code': {
      return codeTemplate({ blockId });
    }
    case 'column_list': {
      return columnListTemplate({ blockId, children });
    }
    case 'column': {
      const spacerWidth = `min(32px, 4vw)`;
      const ratio = block.format?.column_ratio || 0.5;
      const parent = recordMap.block[block.parent_id]?.value;
      const columns =
        parent?.content?.length || Math.max(2, Math.ceil(1.0 / ratio));

      const width = `calc((100% - (${
        columns - 1
      } * ${spacerWidth})) * ${ratio})`;

      return columnTemplate({ blockId, width, children });
    }
    case 'quote': {
      if (!block.properties) return '';
      const blockColor = block.format?.block_color;
      return quoteTemplate({
        blockId,
        blockColor: blockColor ? `notion-${blockColor}` : '',
        renderText: renderText({
          value: block.properties.title,
          block,
          recordMap,
        }),
        children,
      });
    }
    case 'collection_view': {
      return collectionTemplate({ blockId });
    }
    case 'callout': {
      return calloutTemplate({
        blockId,
        blockColor: block.format?.block_color
          ? `notion-${block.format?.block_color}_co`
          : '',
        rendererPageIcon: rendererPageIcon({
          block,
          recordMap,
          defaultIcon: null,
          darkMode,
        }),
        renderText: renderText({
          value: block.properties?.title,
          block,
          recordMap,
        }),
        children,
      });
    }
    case 'bookmark': {
      if (!block.properties) return '';

      const link = block.properties.link;
      if (!link || !link[0]?.[0]) return '';

      let title = getTextContent(block.properties.title);
      if (!title) {
        title = getTextContent(link);
      }

      if (title) {
        if (title.startsWith('http')) {
          try {
            const url = new URL(title);
            title = url.hostname;
          } catch (err) {
            console.log(err);
          }
        }
      }

      const bookmarkTitle = title
        ? bookmarkTitleTemplate({
            renderText: renderText({ value: [[title]], block, recordMap }),
          })
        : '';
      const bookmarkDesc = block.properties?.description
        ? bookmarkDescTemplate({
            renderText: renderText({
              value: block.properties?.description,
              block,
              recordMap,
            }),
          })
        : '';
      const bookmarkLink = block.format?.bookmark_icon
        ? bookmarkLinkTemplate({
            url: mapImageUrl(block.format?.bookmark_icon, block),
            title,
          })
        : '';
      const bookmarkCover = bookmarkCoverTemplate({
        url: mapImageUrl(block.format?.bookmark_cover, block),
        alt: getTextContent(block.properties?.title),
      });
      return bookmarkTemplate({
        blockColor: block.format?.block_color
          ? `notion-${block.format.block_color}`
          : '',
        blockId,
        link: link[0][0],
        bookmarkTitle,
        bookmarkDesc,
        bookmarkLink,
        renderText: renderText({ value: link, block, recordMap }),
        bookmarkCover,
      });
    }
    case 'toggle': {
      return toggleTemplate({
        blockId,
        renderText: renderText({
          value: block.properties?.title,
          block,
          recordMap,
        }),
        children,
      });
    }
    case 'table_of_contents': {
      const page = getBlockParentPage(block, recordMap);
      if (!page) return '';

      const toc = getPageTableOfContents(page, recordMap);
      const blockColor = block.format?.block_color;

      return tocTemplate({
        blockColor: blockColor ? `notion-${blockColor}` : '',
        blockId,
        toc,
        uuidToId,
        multiply: (x: number, y: number) => x * y,
      });
    }
    case 'to_do': {
      const isChecked = block.properties?.checked?.[0]?.[0] === 'Yes';

      return todoTemplate({
        blockId,
        renderCheckbox: renderCheckbox({ isChecked }),
        isChecked: isChecked ? 'notion-to-do-checked' : '',
        renderText: renderText({
          value: block.properties?.title,
          block,
          recordMap,
        }),
        children,
      });
    }
    case 'transclusion_container': {
      return transclusionTemplate({ blockId, children });
    }
    case 'transclusion_reference': {
      return renderSyncpointer({ block, level: level + 1, ...props }) || '';
    }
    case 'alias': {
      const blockPointerId = block?.format?.alias_pointer?.id;
      const linkedBlock = recordMap.block[blockPointerId]?.value;
      if (!linkedBlock) return '';

      return aliasTemplate({
        blockPointerId,
        url: mapPageUrl(blockPointerId),
        renderPageTitle: renderPageTitle({ block: linkedBlock, recordMap }),
      });
    }
    case 'table': {
      return tableTemplate({ blockId, children });
    }
    case 'table_row': {
      const tableBlock = recordMap.block[block.parent_id]?.value as TableBlock;
      const order = tableBlock.format?.table_block_column_order;
      const formatMap = tableBlock.format?.table_block_column_format;
      const backgroundColor = block.format?.block_color;

      if (!tableBlock || !order) return '';

      const td = order
        .map(column => {
          const color = formatMap?.[column]?.color;

          return tdTemplate({
            column,
            color: color ? `notion-${color}` : '',
            width: formatMap?.[column]?.width || 120,
            renderText: renderText({
              value: block.properties?.[column] || [['ㅤ']],
              block,
              recordMap,
            }),
          });
        })
        .join('');

      return trTemplate({
        blockId,
        backgroundColor: backgroundColor ? `notion-${backgroundColor}` : '',
        td,
      });
    }
    case 'external_object_instance': {
      return renderEOI({ block, className: blockId }) || '';
    }
    default:
      return 'JAVED';
  }
}
