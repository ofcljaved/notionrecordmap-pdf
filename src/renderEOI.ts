import { Block } from './types';

interface EOIProps {
  block: Block;
  inline?: boolean;
  className?: string;
}

export function renderEOI({ block, className, inline }: EOIProps) {
  const { original_url, attributes } = block?.format || {};
  if (!original_url || !attributes) return null;

  const title = attributes.find((attr: any) => attr.id === 'title')?.values[0];

  return `
      <a
        target='_blank'
        rel='noopener noreferrer'
        href=${original_url}
        class='notion-external
          ${inline ? 'notion-external-mention' : 'notion-external-block notion-row'}
          ${className}'
      >
          <div class='notion-external-image'><img alt=${title}/></div>
        <div class='notion-external-description'>
          <div class='notion-external-title'>${title}</div>
        </div>
      </a>
    `;
}
