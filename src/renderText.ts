import {
  bTemplate,
  cTemplate,
  commaTemplate,
  defaultUserTemplate,
  hTemplate,
  iTemplate,
  linkTemplate,
  pTemplate,
  sTemplate,
  underscoresTemplate,
  userTemplate,
} from './handlebars/text';
import { renderEOI } from './renderEOI';
import { renderPageTitle } from './renderPageTitle';
import { Block, Decoration, ExtendedRecordMap } from './types';
import { formatDate } from './utils/formatDate';
import { getHashFragmentValue } from './utils/getHashFragmentValue';
import { mapImageUrl } from './utils/mapImageUrl';
import { mapPageUrl } from './utils/mapPageUrl';
import { parsePageId } from './utils/parsePageId';

interface RenderTextProps {
  value: Decoration[] | null;
  block: Block;
  recordMap: ExtendedRecordMap;
}
export function renderText({ value, block, recordMap }: RenderTextProps) {
  const element = value?.map(([text, decorations], index) => {
    if (!decorations) {
      if (text === ',') {
        return commaTemplate({ index });
      } else {
        return text;
      }
    }

    const formatted = decorations?.reduce((element: any, decorator) => {
      switch (decorator[0]) {
        case 'p': {
          const blockId = decorator[1];
          const linkedBlock = recordMap.block[blockId]?.value;
          if (!linkedBlock) return null;

          return pTemplate({
            url: mapPageUrl(blockId),
            pageTitle: renderPageTitle({ block: linkedBlock, recordMap }),
          });
        }

        case '‣': {
          const linkType = decorator[1][0];
          const id = decorator[1][1];

          switch (linkType) {
            case 'u': {
              const user = recordMap.notion_user[id]?.value;

              if (!user) return null;

              const name = [user.given_name, user.family_name]
                .filter(Boolean)
                .join(' ');

              return userTemplate({
                url: mapImageUrl(user.profile_photo, block),
                alt: name,
              });
            }

            default: {
              const linkedBlock = recordMap.block[id]?.value;

              if (!linkedBlock) return null;

              return defaultUserTemplate({
                url: mapPageUrl(id),
                pageTitle: renderPageTitle({ block: linkedBlock, recordMap }),
              });
            }
          }
        }

        case 'h':
          return hTemplate({ decorator: decorator[1], element });
        case 'c':
          return cTemplate({ element });

        case 'b':
          return bTemplate({ element });

        case 'i':
          return iTemplate({ element });

        case 's':
          return sTemplate({ element });

        case '_':
          return underscoresTemplate({ element });

        case 'e':
          return null;

        case 'm':
          return element;

        case 'a': {
          const v = decorator[1];
          const pathname = v.substr(1);
          const id = parsePageId(pathname, { uuid: true });

          const rootDomain = '';
          if ((v[0] === '/' || v.includes(rootDomain)) && id) {
            const href = v.includes(rootDomain)
              ? v
              : `${mapPageUrl(id)}${getHashFragmentValue(v)}`;

            return linkTemplate({ href, element });
          } else {
            return linkTemplate({ href: decorator[1], element });
          }
        }

        case 'd': {
          const v = decorator[1];
          const type = v?.type;

          if (type === 'date') {
            const startDate = v.start_date;

            return formatDate(startDate);
          } else if (type === 'datetime') {
            const startDate = v.start_date;
            const startTime = v.start_time;

            return `${formatDate(startDate)} ${startTime}`;
          } else if (type === 'daterange') {
            const startDate = v.start_date;
            const endDate = v.end_date;

            return `${formatDate(startDate)} → ${endDate ? formatDate(endDate) : ''}`;
          } else {
            return element;
          }
        }

        case 'u': {
          const userId = decorator[1];
          const user = recordMap.notion_user[userId]?.value;

          if (!user) return null;

          const name = [user.given_name, user.family_name]
            .filter(Boolean)
            .join(' ');

          return userTemplate({
            name,
            url: mapImageUrl(user.profile_photo, block),
          });
        }

        case 'eoi': {
          return renderEOI({ block, inline: true });
        }

        default:
          return element;
      }
    }, text);

    return formatted;
  });
  return element?.join('');
}
