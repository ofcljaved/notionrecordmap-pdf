import Handlebars from 'handlebars';

const fullPageSource = `<div class='notion notion-app {{darkMode}} {{blockId}}'><div class='notion-frame'><div class='notion-page-scroller'><main class='notion-page notion-page-no-cover {{pageIcon}} {{pageIconUrl}} notion-full-page {{fullWidth}} {{smallText}}'>{{{rendererPageIcon}}}<h1 class='notion-title'>{{{renderText}}}</h1>{{{collectionViewPage}}}</main></div></div></div>`;

export const fullPageTemplate = Handlebars.compile(fullPageSource);

const collectionViewPageSource = `<div class='notion-page-content'><article class='notion-page-content-inner'>{{{children}}}</article></div>`;

export const collectionViewPageTemplate = Handlebars.compile(
  collectionViewPageSource
);

const nonFullPageSource = `<main
class='notion {{darkMode}} notion-page {{fullWidth}} {{smallText}} {blockId}'>{{{children}}}</main>`;

export const nonFullPageTemplate = Handlebars.compile(nonFullPageSource);

const pageSource = `<a class='notion-page-link {{blockColor}} {{blockId}}' href={{url}}>{{{renderPageTitle}}}</a>`;

export const pageTemplate = Handlebars.compile(pageSource);

const innerHeaderSource = `<span><div id="{{id}}" class='notion-header-anchor'></div>{{{toggleableHeader}}}<span class='notion-h-title'>{{{renderText}}}</span></span>`;

export const innerHeaderTemplate = Handlebars.compile(innerHeaderSource);

const nonToggleableHeaderSource = `<a class='notion-hash-link' href='#{{id}}' title='{{title}}'><svg viewBox='0 0 16 16' width='16' height='16' ><path fillRule='evenodd' d='M7.775 3.275a.75.75 0 001.06 1.06l1.25-1.25a2 2 0 112.83 2.83l-2.5 2.5a2 2 0 01-2.83 0 .75.75 0 00-1.06 1.06 3.5 3.5 0 004.95 0l2.5-2.5a3.5 3.5 0 00-4.95-4.95l-1.25 1.25zm-4.69 9.64a2 2 0 010-2.83l2.5-2.5a2 2 0 012.83 0 .75.75 0 001.06-1.06 3.5 3.5 0 00-4.95 0l-2.5 2.5a3.5 3.5 0 004.95 4.95l1.25-1.25a.75.75 0 00-1.06-1.06l-1.25 1.25a2 2 0 01-2.83 0z'/></svg></a>`;

export const nonToggleableHeaderTemplate = Handlebars.compile(
  nonToggleableHeaderSource
);

const h1Source = `<h2 class='{{classNameStr}}' data-id="{{id}}">{{{innerHeader}}}</h2>`;

export const h1Template = Handlebars.compile(h1Source);

const h2Source = `<h3 class='{{classNameStr}}' data-id="{{id}}">{{{innerHeader}}}</h3>`;

export const h2Template = Handlebars.compile(h2Source);

const h3Source = `<h4 class='{{classNameStr}}' data-id="{{id}}">{{{innerHeader}}}</h4>`;

export const h3Template = Handlebars.compile(h3Source);

const toggleableSource = `<details class='notion-toggle {{blockId}}' open><summary>{{{headerBlock}}}</summary><div>{{{children}}}</div></details>`;

export const toggleableTemplate = Handlebars.compile(toggleableSource);

const dividerSource = `<hr class='notion-hr {{blockId}}'/>`;

export const dividerTemplate = Handlebars.compile(dividerSource);

const blankTextSource = `<div class='notion-blank {{blockId}}'>&nbsp;</div>`;

export const blankTextTemplate = Handlebars.compile(blankTextSource);

const textSource = `<div class='notion-text {{blockColor}} {{blockId}}'>{{{title}}}{{{children}}}</div>`;

export const textTemplate = Handlebars.compile(textSource);

const textChildrenSource = `<div class='notion-text-children'>{{{children}}}</div>`;

export const textChildrenTemplate = Handlebars.compile(textChildrenSource);

const ulSource = `<ul class='notion-list notion-list-disc {{blockId}}'>{{{content}}}</ul>`;

export const ulTemplate = Handlebars.compile(ulSource);

const olSource = `<ol start={{start}} class='notion-list notion-list-numbered {{blockId}}'>{{{content}}}</ol>`;

export const olTemplate = Handlebars.compile(olSource);

const liSource = `<li>{{{renderText}}}</li>`;

export const liTemplate = Handlebars.compile(liSource);

const embedSource = `<div>{{{blockId}}} not supported</div>`;

export const embedTemplate = Handlebars.compile(embedSource);

const equationSource = `<div>{{{blockId}}} equation not supported</div>`;

export const equationTemplate = Handlebars.compile(equationSource);

const codeSource = `<div>{{{blockId}}} code not supported</div>`;

export const codeTemplate = Handlebars.compile(codeSource);

const columnListSource = `<div class='notion-row {{blockId}}'>{{{children}}}</div>`;

export const columnListTemplate = Handlebars.compile(columnListSource);

const columnSource = `<div class='notion-column {{blockId}}' style='width:{{width}}'>{{{children}}}</div>
<div class='notion-spacer'></div>`;

export const columnTemplate = Handlebars.compile(columnSource);

const quoteSource = `<blockquote class='notion-quote {{blockColor}} {{blockId}}'><div>{{{renderText}}}</div>{{{children}}}</blockquote>`;

export const quoteTemplate = Handlebars.compile(quoteSource);

const collectionSource = `<div>{{{blockId}}} collection not supported</div>`;

export const collectionTemplate = Handlebars.compile(collectionSource);

const calloutSource = `<div class='notion-callout {{blockColor}} {{blockId}}'>{{{rendererPageIcon}}}<div className='notion-callout-text'>{{{renderText}}}{{{children}}}</div></div>`;

export const calloutTemplate = Handlebars.compile(calloutSource);

const bookmarkTitleSource = `<div class='notion-bookmark-title'>{{{renderText}}}</div>`;

export const bookmarkTitleTemplate = Handlebars.compile(bookmarkTitleSource);

const bookmarkDescSource = `<div class='notion-bookmark-description'>{{{renderText}}}</div>`;

export const bookmarkDescTemplate = Handlebars.compile(bookmarkDescSource);

const bookmarkLinkSource = `<div class='notion-bookmark-link-icon'><img src={{url}} alt={{title}}/></div>`;

export const bookmarkLinkTemplate = Handlebars.compile(bookmarkLinkSource);

const bookmarkCoverSource = `<div class='notion-bookmark-image'><img src={{url}} alt={{alt}} style='object-fit: cover;'/></div>`;

export const bookmarkCoverTemplate = Handlebars.compile(bookmarkCoverSource);

const bookmarkSource = `<div class='notion-row'><a target='_blank' rel='noopener noreferrer' class='notion-bookmark {{blockColor}} {{blockId}}' href={{link}}><div>{{{bookmarkTitle}}}{{{bookmarkDesc}}}<div class='notion-bookmark-link'>{{{bookmarkLink}}}<div class='notion-bookmark-link-text'>{{{renderText}}}</div></div></div>{{{bookmarkCover}}}</a></div>`;

export const bookmarkTemplate = Handlebars.compile(bookmarkSource);

const toggleSource = `<details class='notion-toggle {{blockId}}' open><summary>{{{renderText}}}</summary><div>{{{children}}}</div></details>`;

export const toggleTemplate = Handlebars.compile(toggleSource);

const tocSource = `<div class='notion-table-of-contents {{blockColor}} {{blockId}}>{{#each toc}}<a key={{id}} href='#{{uuidToId id}}'  class='notion-table-of-contents-item'><span class='notion-table-of-contents-item-body' style='display:inline-block; margin-left: {{multiply indentLevel 24}};'>{{text}}</span></a>{{/each}}</div>`;

export const tocTemplate = Handlebars.compile(tocSource);

const todoSource = `<div class='notion-to-do {{blockId}}'><div class='notion-to-do-item'>{{{renderCheckbox}}}<div class='notion-to-do-body {{isChecked}}'>{{{renderText}}}</div></div><div class='notion-to-do-children'>{{{children}}}</div></div>`;

export const todoTemplate = Handlebars.compile(todoSource);

const transclusionSource = `<div class='notion-sync-block {{blockId}}'>{{{children}}}</div>`;

export const transclusionTemplate = Handlebars.compile(transclusionSource);

const aliasSource = `<a class='notion-page-link {{blockPointerId}}' href='{{url}}'>{{{renderPageTitle}}}</a>`;

export const aliasTemplate = Handlebars.compile(aliasSource);

const tableSource = `<table class='notion-simple-table {{blockId}}'><tbody>{{{children}}}</tbody></table>`;

export const tableTemplate = Handlebars.compile(tableSource);

const tdSource = `<td key={{column}} class='{{color}}
' style='width:{{width}}'><div class='notion-simple-table-cell'>{{{renderText}}}</div></td>`;

export const tdTemplate = Handlebars.compile(tdSource);

const trSource = `<tr class='notion-simple-table-row{{backgroundColor}} {{blockId}}'>{{{td}}}</tr>`;

export const trTemplate = Handlebars.compile(trSource);
