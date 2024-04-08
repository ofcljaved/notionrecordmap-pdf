import { eoiTemplate } from './handlebars/eoi';
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

  return eoiTemplate({
    original_url,
    title,
    className,
    inline: inline
      ? 'notion-external-mention'
      : 'notion-external-block notion-row',
  });
}
