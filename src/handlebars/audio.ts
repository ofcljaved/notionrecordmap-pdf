import Handlebars from 'handlebars';

const figureSource = `
<figure class='notion-asset-wrapper notion-asset-wrapper-{{type}} {{fullWidth}} {{blockId}}'>{{{assets}}}</figure>
`;

export const figureTemplate = Handlebars.compile(figureSource);
