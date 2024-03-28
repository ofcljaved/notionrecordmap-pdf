import { renderer } from './renderer';
import { Block, ExtendedRecordMap, SyncPointerBlock } from './types';

interface RenderSyncpointerProps {
  block: Block;
  level: number;
  recordMap: ExtendedRecordMap;
  fullPage: boolean;
  darkMode: boolean;
}
export function renderSyncpointer({
  block,
  level,
  ...props
}: RenderSyncpointerProps) {
  if (!block) return '';
  const syncPointerBlock = block as SyncPointerBlock;
  const referencePointerId =
    syncPointerBlock?.format?.transclusion_reference_pointer?.id;

  if (!referencePointerId) return '';

  return renderer({ level, blockId: referencePointerId, ...props });
}
