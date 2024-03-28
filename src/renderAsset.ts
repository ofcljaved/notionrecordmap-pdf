import { renderText } from './renderText';
import { BaseContentBlock, Block, ExtendedRecordMap } from './types';
import { getTextContent } from './utils/getTextContent';
import { mapImageUrl } from './utils/mapImageUrl';
import { mapPageUrl } from './utils/mapPageUrl';
import { parsePageId } from './utils/parsePageId';

interface RenderAssetsProps {
  blockId: string;
  block: Block;
  recordMap: ExtendedRecordMap;
}

interface CSSProperties {
  [key: string]: string | number;
}

const isServer = typeof window === 'undefined';
const supportedAssetTypes = [
  'replit',
  'video',
  'image',
  'embed',
  'figma',
  'typeform',
  'excalidraw',
  'maps',
  'tweet',
  'pdf',
  'gist',
  'codepen',
  'drive',
];
function assets({
  block,
  isURL,
  recordMap,
}: {
  block: BaseContentBlock;
  isURL: boolean;
  recordMap: ExtendedRecordMap;
}) {
  if (!block || !supportedAssetTypes.includes(block.type)) return '';

  const style: CSSProperties = {
    position: 'relative',
    display: 'flex',
    'justify-content': 'center',
    'align-self': 'center',
    width: '100%',
    'max-width': '100%',
    'flex-direction': 'column',
  };

  const children =
    block?.properties?.caption && !isURL
      ? `
    <figcaption className='notion-asset-caption'>
      ${renderText({ value: block.properties.caption, block: block as Block, recordMap })}
    </figcaption>
    `
      : '';

  const assetStyle: CSSProperties = {};

  if (block.format) {
    const {
      block_aspect_ratio,
      block_height,
      block_width,
      block_full_width,
      block_page_width,
      block_preserve_scale,
    } = block.format;

    if (block_full_width || block_page_width) {
      if (block_full_width) {
        style.width = '100vw';
      } else {
        style.width = '100%';
      }

      if (block.type === 'video') {
        if (block_height) {
          style.height = block_height;
        } else if (block_aspect_ratio) {
          style['padding-bottom'] = `${block_aspect_ratio * 100}%`;
        } else if (block_preserve_scale) {
          style['object-fit'] = 'contain';
        }
      } else if (block_aspect_ratio && block.type !== 'image') {
        style['padding-bottom'] = `${block_aspect_ratio * 100}%`;
      } else if (block_height) {
        style.height = block_height;
      } else if (block_preserve_scale) {
        if (block.type === 'image') {
          style.height = '100%';
        } else {
          style['padding-bottom'] = '75%';
          style['min-height'] = 100;
        }
      }
    } else {
      switch (block.format?.block_alignment) {
        case 'center': {
          style['align-self'] = 'center';
          break;
        }
        case 'left': {
          style['align-self'] = 'start';
          break;
        }
        case 'right': {
          style['align-self'] = 'end';
          break;
        }
      }

      if (block_width) {
        style.width = block_width;
      }

      if (block_preserve_scale && block.type !== 'image') {
        style['padding-bottom'] = '50%';
        style['min-height'] = 100;
      } else {
        if (block_height && block.type !== 'image') {
          style.height = block_height;
        }
      }
    }

    if (block.type === 'image') {
      assetStyle['object-fit'] = 'cover';
    } else if (block_preserve_scale) {
      assetStyle['object-fit'] = 'contain';
    }
  }

  let source =
    recordMap.signed_urls?.[block.id] || block.properties?.source?.[0]?.[0];
  let content = null;

  if (!source) return '';

  if (block.type === 'tweet') {
    const src = source;
    if (!src) return null;

    const id = src.split('?')[0].split('/').pop();
    if (!id) return null;

    const newAssetStyle = {
      ...assetStyle,
      maxWidth: 420,
      width: '100%',
      marginLeft: 'auto',
      marginRight: 'auto',
    };
    const divStyle = Object.entries(newAssetStyle)
      .map(elem => elem.join(':'))
      .join(';');
    content = `
      <div style="${divStyle}">
        <div data-id="${id}">Tweet are not supported</div>
      </div>
    `;
  } else if (block.type === 'pdf') {
    if (!isServer) {
      // console.log('pdf', block, signedUrl)
      content = `<div>PDF ${source} are not supported</div>`;
    }
  } else if (
    block.type === 'embed' ||
    block.type === 'video' ||
    block.type === 'figma' ||
    block.type === 'typeform' ||
    block.type === 'gist' ||
    block.type === 'maps' ||
    block.type === 'excalidraw' ||
    block.type === 'codepen' ||
    block.type === 'drive' ||
    block.type === 'replit'
  ) {
    if (
      block.type === 'video' &&
      source &&
      source.indexOf('youtube') < 0 &&
      source.indexOf('youtu.be') < 0 &&
      source.indexOf('vimeo') < 0 &&
      source.indexOf('wistia') < 0 &&
      source.indexOf('loom') < 0 &&
      source.indexOf('videoask') < 0 &&
      source.indexOf('getcloudapp') < 0
    ) {
      content = `<div>Video title:${block.type} ${source} are not supported</div>`;
    } else {
      let src = block.format?.display_source || source;

      if (src) {
        if (block.type === 'video') {
          content = `<div>Youtube Video ${src} are not supported</div>`;
        } else if (block.type === 'gist') {
          if (!src.endsWith('.pibb')) {
            src = `${src}.pibb`;
          }
          assetStyle.width = '100%';
          style.paddingBottom = '50%';
          const gistStyle = Object.entries(assetStyle)
            .map(elem => elem.join(':'))
            .join(';');

          content = `<iframe style="${gistStyle}" class='notion-asset-object-fit' src="${src}" title='GitHub Gist' frameBorder='0'allow-forms allow-same-origin' scrolling='auto'
            />`;
        } else {
          src += block.type === 'typeform' ? '&disable-auto-focus=true' : '';
          const gistStyle = Object.entries(assetStyle)
            .map(elem => elem.join(':'))
            .join(';');
          content = `<iframe class='notion-asset-object-fit' style="${gistStyle}" src="${src}" title="${`iframe ${block.type}`}" frameBorder='0' allowFullScreen scrolling='auto'
            />`;
        }
      }
    }
  } else if (block.type === 'image') {
    if (source.includes('file.notion.so')) {
      source = block.properties?.source?.[0]?.[0];
    }
    const src = mapImageUrl(source, block as Block);
    const caption = getTextContent(block.properties?.caption);
    const alt = caption || 'notion image';

    const imgStyle = Object.entries(assetStyle)
      .map(elem => elem.join(':'))
      .join(';');
    content = `<img src="${src}" alt="${alt}" height="${style.height}" style="${imgStyle}" />`;
  }

  const divStyle = Object.entries(style)
    .map(elem => elem.join(':'))
    .join(';');
  return `
      <div style="${divStyle}">
        ${content}
        ${block.type === 'image' ? children : ''}
      </div>
      ${block.type !== 'image' ? children : ''}
      `;
}

export function renderAssets({ block, blockId, recordMap }: RenderAssetsProps) {
  const value = block as BaseContentBlock;

  let isURL = false;
  if (block.type === 'image') {
    const caption = value?.properties?.caption?.[0]?.[0];
    if (caption) {
      const id = parsePageId(caption, { uuid: true });

      const isPage = caption.charAt(0) === '/' && id;
      if (isPage || isValidURL(caption)) {
        isURL = true;
      }
    }
  }

  const figure = `<figure
      class='notion-asset-wrapper notion-asset-wrapper-${block.type} ${value.format?.block_full_width ? 'notion-asset-wrapper-full' : ''} ${blockId}'
    >
      ${assets({ block: value, isURL, recordMap })}
    </figure>`;

  if (isURL) {
    const caption = value?.properties?.caption?.[0]?.[0];
    const id = parsePageId(caption, { uuid: true });
    const isPage = caption?.charAt(0) === '/' && id;

    return `<a
          style='width:100%;'
          href=${isPage ? mapPageUrl(id) : caption}
          target='blank_'
        >
          ${figure}
        </a>`;
  }

  return figure;
}

function isValidURL(str: string) {
  const pattern = new RegExp(
    '^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$',
    'i'
  );
  return !!pattern.test(str);
}
