import { renderBlock } from './renderBlock';
import { ExtendedRecordMap } from './types';

interface RendererProps {
  recordMap: ExtendedRecordMap;
  blockId?: string;
  level?: number;
  fullPage: boolean;
  darkMode: boolean;
}

export function renderer({
  recordMap,
  blockId,
  level = 0,
  ...props
}: RendererProps) {
  const id = blockId || Object.keys(recordMap.block)[0];
  const block = recordMap.block[id]?.value;

  if (!block) return '';

  const value = renderBlock({ level, block, recordMap, ...props });
  return value;
}
