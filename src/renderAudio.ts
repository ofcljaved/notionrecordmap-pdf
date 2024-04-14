import { audioTemplate } from './handlebars/audio';
import { AudioBlock, ExtendedRecordMap } from './types';

interface RenderAudioProps {
  block: AudioBlock;
  blockId: string;
  recordMap: ExtendedRecordMap;
}
export function renderAudio({ block, blockId, recordMap }: RenderAudioProps) {
  const source =
    recordMap.signed_urls[block.id] || block.properties?.source?.[0]?.[0];

  return audioTemplate({ blockId, source });
}
