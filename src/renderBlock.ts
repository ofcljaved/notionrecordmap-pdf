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

          return `<div class='notion notion-app ${darkMode ? 'dark-mode' : 'light-mode'} ${blockId}' >
              <div class='notion-frame'>
                <div class='notion-page-scroller'>
                  <main class='notion-page notion-page-no-cover ${page_icon ? 'notion-page-has-icon' : 'notion-page-no-icon'} ${isPageIconUrl ? 'notion-page-has-image-icon' : 'notion-page-has-text-icon'} notion-full-page ${page_full_width ? 'notion-full-width' : ''} ${page_small_text ? 'notion-small-text' : ''}'>
                    ${
                      page_icon
                        ? rendererPageIcon({
                            block,
                            defaultIcon: defaultPageIcon,
                            inline: false,
                            recordMap,
                            darkMode,
                          })
                        : ''
                    }
                    <h1 class='notion-title'>
                      ${renderText({ value: properties?.title || null, block, recordMap })}
                    </h1>
                    ${
                      block.type !== 'collection_view_page' &&
                      `<div class='notion-page-content'>
                        <article class='notion-page-content-inner'>
                          ${children}
                        </article>
                      </div>`
                    }
                  </main>
                </div>
              </div>
            </div>`;
        } else {
          return `<main
              class='notion ${darkMode ? 'dark-mode' : 'light-mode'} notion-page ${page_full_width ? 'notion-full-width' : ''} ${page_small_text ? 'notion-small-text' : ''} ${blockId}'
            >
              ${block.type !== 'collection_view_page' && children}
            </main>`;
        }
      } else {
        const blockColor = block.format?.block_color;

        return `
          <a
            class='notion-page-link ${blockColor && `notion-${blockColor}`} ${blockId}'
            href=${mapPageUrl(block.id)}
          >
            ${renderPageTitle({ block, recordMap })}
          </a>
        `;
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

      const classNameStr = ` ${isH1 ? 'notion-h notion-h1' : ''} ${isH2 ? 'notion-h notion-h2' : ''} ${isH3 ? 'notion-h notion-h3' : ''} ${blockColor ? `notion-${blockColor}` : ''} ${indentLevelClass} ${blockId}`;

      const innerHeader = `
        <span>
          <div id="${id}" class='notion-header-anchor'></div>
          ${
            !block.format?.toggleable
              ? `<a class='notion-hash-link' href='#${id}' title='${title}'>
              <svg
                viewBox='0 0 16 16'
                width='16'
                height='16'
              >
                <path
                  fillRule='evenodd'
                  d='M7.775 3.275a.75.75 0 001.06 1.06l1.25-1.25a2 2 0 112.83 2.83l-2.5 2.5a2 2 0 01-2.83 0 .75.75 0 00-1.06 1.06 3.5 3.5 0 004.95 0l2.5-2.5a3.5 3.5 0 00-4.95-4.95l-1.25 1.25zm-4.69 9.64a2 2 0 010-2.83l2.5-2.5a2 2 0 012.83 0 .75.75 0 001.06-1.06 3.5 3.5 0 00-4.95 0l-2.5 2.5a3.5 3.5 0 004.95 4.95l1.25-1.25a.75.75 0 00-1.06-1.06l-1.25 1.25a2 2 0 01-2.83 0z'
                />
              </svg>
            </a>`
              : ''
          }
          <span class='notion-h-title'>
            ${renderText({ block, recordMap, value: block.properties.title })}
          </span>
        </span>
      `;
      let headerBlock = null;

      if (isH1) {
        headerBlock = `
          <h2 class='${classNameStr}' data-id="${id}">
            ${innerHeader}
          </h2>
        `;
      } else if (isH2) {
        headerBlock = `
          <h3 class='${classNameStr}' data-id="${id}">
            ${innerHeader}
          </h3>
        `;
      } else {
        headerBlock = `
          <h4 class='${classNameStr}' data-id="${id}">
            ${innerHeader}
          </h4>
        `;
      }

      if (block.format?.toggleable) {
        return `
          <details class='notion-toggle ${blockId}' open>
            <summary>${headerBlock}</summary>
            <div>${children}</div>
          </details>
        `;
      } else {
        return headerBlock;
      }
    }
    case 'divider': {
      return `<hr class='notion-hr ${blockId}' />`;
    }
    case 'text': {
      if (!block.properties && !block.content?.length) {
        return `<div class='notion-blank ${blockId}'>&nbsp;</div>`;
      }

      const blockColor = block.format?.block_color;

      return `
        <div class='notion-text ${blockColor ? `notion-${blockColor}` : ''} ${blockId}'>
          ${
            block.properties?.title
              ? renderText({ block, recordMap, value: block.properties.title })
              : ''
          }
          ${
            children
              ? `<div class='notion-text-children'>${children}</div>`
              : ''
          }
        </div>
      `;
    }
    case 'bulleted_list':
    case 'numbered_list': {
      const wrapList = (content: string, start?: number) =>
        block.type === 'bulleted_list'
          ? `<ul class='notion-list notion-list-disc ${blockId}'>
            ${content}
          </ul>`
          : `<ol start=${start} class='notion-list notion-list-numbered ${blockId}'>
            ${content}
          </ol>`;
      let output: string = '';

      if (block.content) {
        output = `
              ${
                block.properties
                  ? `<li>
                  ${renderText({ block, recordMap, value: block.properties.title })}
                </li>`
                  : ''
              }
              ${wrapList(children)}
            `;
      } else {
        output = block.properties
          ? `<li>
              ${renderText({ block, recordMap, value: block.properties.title })}
            </li>`
          : '';
      }

      const isTopLevel =
        block.type !== recordMap.block[block.parent_id]?.value?.type;
      const start = getListNumber(block.id, recordMap.block);

      return isTopLevel ? wrapList(output, start) : output;
    }
    case 'embed': {
      return `<div>${blockId} not supported</div>`;
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
      return `<div>${blockId} equation not supported</div>`;
    }
    case 'code': {
      return `<div>${blockId} code not supported</div>`;
    }
    case 'column_list': {
      return `<div class='notion-row ${blockId}'>${children}</div>`;
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

      return `
          <div class='notion-column ${blockId}' style='width:${width}'>
            ${children}
          </div>
          <div class='notion-spacer' />
        `;
    }
    case 'quote': {
      if (!block.properties) return '';
      const blockColor = block.format?.block_color;
      return `
        <blockquote class='notion-quote ${blockColor ? `notion-${blockColor}` : ''} ${blockId}'>
          <div>
            ${renderText({ value: block.properties.title, block, recordMap })}
          </div>
          ${children}
        </blockquote>
      `;
    }
    case 'collection_view': {
      return `<div>${blockId} collection not supported</div>`;
    }
    case 'callout': {
      return `
          <div
            class='notion-callout ${block.format?.block_color ? `notion-${block.format?.block_color}_co` : ''} ${blockId}'
            )}
          >
            ${rendererPageIcon({ block, recordMap, defaultIcon: null, darkMode })}
            <div className='notion-callout-text'>
              ${renderText({ value: block.properties?.title, block, recordMap })}
              ${children}
            </div>
          </div>
        `;
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

      return `
        <div class='notion-row'>
          <a target='_blank' rel='noopener noreferrer' class= 'notion-bookmark ${block.format?.block_color ? `notion-${block.format.block_color}` : ''} ${blockId}' href=${link[0][0]}
          >
            <div>
              ${
                title
                  ? `<div class='notion-bookmark-title'>
                  ${renderText({ value: [[title]], block, recordMap })}
                </div>`
                  : ''
              }
              ${
                block.properties?.description
                  ? `<div class='notion-bookmark-description'>
                  ${renderText({ value: block.properties?.description, block, recordMap })}
                </div>`
                  : ''
              }
              <div class='notion-bookmark-link'>
                ${
                  block.format?.bookmark_icon
                    ? `<div class='notion-bookmark-link-icon'>
                    <img
                      src=${mapImageUrl(block.format?.bookmark_icon, block)}
                      alt=${title}
                    />
                  </div>`
                    : ''
                }
                <div class='notion-bookmark-link-text'>
                ${renderText({ value: link, block, recordMap })}
                </div>
              </div>
            </div>

            ${
              block.format?.bookmark_cover
                ? `<div className='notion-bookmark-image'>
                <img
                  src=${mapImageUrl(block.format?.bookmark_cover, block)}
                  alt=${getTextContent(block.properties?.title)}
                  style='object-fit: cover;'
                />
              </div>`
                : ''
            }
          </a>
        </div>
      `;
    }
    case 'toggle': {
      return `
        <details class='notion-toggle ${blockId}' open>
          <summary>
            ${renderText({ value: block.properties?.title, block, recordMap })}
          </summary>
          <div>${children}</div>
        </details>`;
    }
    case 'table_of_contents': {
      const page = getBlockParentPage(block, recordMap);
      if (!page) return '';

      const toc = getPageTableOfContents(page, recordMap);
      const blockColor = block.format?.block_color;

      return `
        <div
          class='notion-table-of-contents ${blockColor ? `notion-${blockColor}` : ''} ${blockId}>
          ${toc
            .map(
              tocItem =>
                `<a key=${tocItem.id} href='#${uuidToId(tocItem.id)}' class='notion-table-of-contents-item'>
              <span class='notion-table-of-contents-item-body'
                style='display:inline-block; margin-left: ${tocItem.indentLevel * 24};'
              >
                ${tocItem.text}
              </span>
            </a>`
            )
            .join('')}
        </div>
      `;
    }
    case 'to_do': {
      const isChecked = block.properties?.checked?.[0]?.[0] === 'Yes';

      return `
        <div className={cs('notion-to-do', blockId)}>
          <div className='notion-to-do-item'>
            ${renderCheckbox({ isChecked })}
            <div class='notion-to-do-body ${isChecked ? 'notion-to-do-checked' : ''}'>
                ${renderText({ value: block.properties?.title, block, recordMap })}
            </div>
          </div>
          <div class='notion-to-do-children'>${children}</div>
        </div>
      `;
    }
    case 'transclusion_container': {
      return `<div class='notion-sync-block ${blockId}'>${children}</div>`;
    }
    case 'transclusion_reference': {
      return renderSyncpointer({ block, level: level + 1, ...props }) || '';
    }
    case 'alias': {
      const blockPointerId = block?.format?.alias_pointer?.id;
      const linkedBlock = recordMap.block[blockPointerId]?.value;
      if (!linkedBlock) return '';

      return `
        <a class='notion-page-link ${blockPointerId}' href='${mapPageUrl(blockPointerId)}'>
          ${renderPageTitle({ block: linkedBlock, recordMap })}
        </a>
      `;
    }
    case 'table': {
      return `
        <table class='notion-simple-table ${blockId}'>
          <tbody>${children}</tbody>
        </table>
      `;
    }
    case 'table_row': {
      const tableBlock = recordMap.block[block.parent_id]?.value as TableBlock;
      const order = tableBlock.format?.table_block_column_order;
      const formatMap = tableBlock.format?.table_block_column_format;
      const backgroundColor = block.format?.block_color;

      if (!tableBlock || !order) return '';

      return `
        <tr
          class='notion-simple-table-row ${backgroundColor ? `notion-${backgroundColor}` : ''} ${blockId}
        >
          ${order
            .map(column => {
              const color = formatMap?.[column]?.color;

              return `
              <td
                key=${column}
                class=${color ? `notion-${color}` : ''}
                style='width: ${formatMap?.[column]?.width || 120}'
              >
                <div class='notion-simple-table-cell'>
                  ${renderText({ value: block.properties?.[column] || [['ㅤ']], block, recordMap })}
                </div>
              </td>
            `;
            })
            .join('')}
        </tr>
      `;
    }
    case 'external_object_instance': {
      return renderEOI({ block, className: blockId }) || '';
    }
    default:
      return 'JAVED';
  }
}
