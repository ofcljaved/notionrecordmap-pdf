import { GoogleDriveBlock } from './types';
import { mapImageUrl } from './utils/mapImageUrl';

interface RenderGoogledriveProps {
  block: GoogleDriveBlock;
  blockId: string;
}

export function renderGoogledrive({ block, blockId }: RenderGoogledriveProps) {
  const properties = block.format?.drive_properties;
  if (!properties) return '';

  let domain;

  try {
    const url = new URL(properties.url);
    domain = url.hostname;
  } catch (err) {
    console.log(err);
  }

  return `<div class='notion-google-drive ${blockId}'>
      <a class='notion-google-drive-link' href=${properties.url} target='_blank' rel='noopener noreferrer'>
        <div class='notion-google-drive-preview'>
          <img src=${mapImageUrl(properties.thumbnail, block)} alt=${properties.title || 'Google Drive Document'} />
        </div>
        <div class='notion-google-drive-body'>
          ${properties.title ? `<div class='notion-google-drive-body-title'>${properties.title}</div>` : ''}
          ${
            properties.icon && domain
              ? `<div class='notion-google-drive-body-source'>
              ${
                properties.icon
                  ? `<div class='notion-google-drive-body-source-icon' style= 'background-image: url(${properties.icon})'/>`
                  : ''
              }
              ${domain ? `<div class='notion-google-drive-body-source-domain'>${domain}</div>` : ''}
            </div>`
              : ''
          }
        </div>
      </a>
    </div>`;
}
