import Handlebars from 'handlebars';

const codeSource = `<div><pre class='notion-code {{blockId}} language-{{language}}'><code class='language-{{language}}'>{{{content}}}</code></pre>{{{codeCaption}}}</div>`;

export const codeTemplate = Handlebars.compile(codeSource);

const codeCaptionSource = `<figcaption class='notion-asset-caption'>{{{renderText}}}</figcaption>`;

export const codeCaptionTemplate = Handlebars.compile(codeCaptionSource);
