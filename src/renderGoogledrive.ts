import {
  domainTemplate,
  driveBodyTemplate,
  driveTemplate,
  iconTemplate,
  titleTemplate,
} from './handlebars/googleDrive';
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

  const title = properties.title
    ? titleTemplate({ title: properties.title })
    : '';

  const icon = properties.icon ? iconTemplate({ icon: properties.icon }) : '';

  const domainSource = domain ? domainTemplate({ domain }) : '';

  const driveBody =
    properties.icon && domain ? driveBodyTemplate({ icon, domainSource }) : '';

  return driveTemplate({
    blockId,
    url: properties.url,
    src: mapImageUrl(properties.thumbnail, block),
    alt: properties.title || 'Google Drive Document',
    title,
    driveBody,
  });
}
