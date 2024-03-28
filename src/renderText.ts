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
        return `<span key=${index} style='padding:0.5em;' />`;
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

          return `<a
                class='notion-link'
                href=${mapPageUrl(blockId)}
              >
                ${renderPageTitle({ block: linkedBlock, recordMap })}
              </a>`;
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

              return `
                  <img
                    class='notion-user'
                    src=${mapImageUrl(user.profile_photo, block)}
                    alt=${name}
                  />
                  `;
            }

            default: {
              const linkedBlock = recordMap.block[id]?.value;

              if (!linkedBlock) return null;

              return `
                  <a
                    class='notion-link'
                    href=${mapPageUrl(id)}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    ${renderPageTitle({ block: linkedBlock, recordMap })}
                  </a>
                `;
            }
          }
        }

        case 'h':
          return `<span class='notion-${decorator[1]}'>${element}</span>`;
        case 'c':
          return `<code class='notion-inline-code'>${element}</code>`;

        case 'b':
          return `<b>${element}</b>`;

        case 'i':
          return `<em>${element}</em>`;

        case 's':
          return `<s>${element}</s>`;

        case '_':
          return `
              <span class='notion-inline-underscore'>${element}</span>
            `;

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

            return `
                <a
                  class='notion-link'
                  href=${href}
                >
                  ${element}
                </a>
              `;
          } else {
            return `
                <a
                  class='notion-link'
                  href=${decorator[1]}
                >
                  ${element}
                </a>
              `;
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

          return `<img
                class='notion-user'
                src=${mapImageUrl(user.profile_photo, block)}
                alt=${name}
              />`;
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
