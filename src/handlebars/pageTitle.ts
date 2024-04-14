import Handlebars from 'handlebars';

const pageTitleSource = `<span class='{{className}} notion-page-title'>{{{pageIcon}}}<span class='notion-page-title-text'>{{{text}}}</span></span>`;

export const pageTitleTemplate = Handlebars.compile(pageTitleSource);
