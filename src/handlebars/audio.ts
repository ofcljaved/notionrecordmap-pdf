import Handlebars from 'handlebars';

const audioSource = `
<div class='notion-audio {{blockId}}'><audio controls preload='none' src={{source}} /></div>
`;

export const audioTemplate = Handlebars.compile(audioSource);
