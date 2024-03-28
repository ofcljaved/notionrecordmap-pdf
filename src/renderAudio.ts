import { AudioBlock, ExtendedRecordMap } from './types';

interface RenderAudioProps {
  block: AudioBlock;
  blockId: string;
  recordMap: ExtendedRecordMap;
}
export function renderAudio({ block, blockId, recordMap }: RenderAudioProps) {
  const source =
    recordMap.signed_urls[block.id] || block.properties?.source?.[0]?.[0];

  return `
      <div class='notion-audio ${blockId}'>
        <audio controls preload='none' src=${source} />
      </div>
    `;
}
