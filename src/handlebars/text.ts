import Handlebars from 'handlebars';

const commaSource = `<span key={{index}} style='padding:0.5em;'/>`;

export const commaTemplate = Handlebars.compile(commaSource);

const pSource = `<a class='notion-link' href={{url}}>{{{pageTitle}}}</a>`;

export const pTemplate = Handlebars.compile(pSource);

const userSource = `<img class='notion-user' src={{url}}alt={{alt}}/>`;

export const userTemplate = Handlebars.compile(userSource);

const defaultUserSource = `<a class='notion-link' href={{url}} target='_blank' rel='noopener noreferrer'>{{{pageTitle}}}</a>`;

export const defaultUserTemplate = Handlebars.compile(defaultUserSource);

const hSource = `<span class='notion-{{decorator}}'>{{{element}}}</span>`;

export const hTemplate = Handlebars.compile(hSource);

const cSource = `<code class='notion-inline-code'>{{{element}}}</code>`;

export const cTemplate = Handlebars.compile(cSource);

const bSource = `<b>{{{element}}}</b>`;

export const bTemplate = Handlebars.compile(bSource);

const iSource = `<em>{{{element}}}</em>`;

export const iTemplate = Handlebars.compile(iSource);

const sSource = `<s>{{{element}}}</s>`;

export const sTemplate = Handlebars.compile(sSource);

const underscoreSource = `<span class='notion-inline-underscore'>{{{element}}}</span>`;

export const underscoresTemplate = Handlebars.compile(underscoreSource);

const linkSource = `<a class='notion-link' href={{href}}>{{{element}}}</a>`;

export const linkTemplate = Handlebars.compile(linkSource);
