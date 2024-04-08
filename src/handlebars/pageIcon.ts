import Handlebars from 'handlebars';

const iconSource = `<img src={{url}} alt={{title}} class='{{className}} notion-page-icon'/>`;

export const iconTemplate = Handlebars.compile(iconSource);

const nonIconSource = `<span class='{{className}} notion-page-icon' role='img' aria-label={{icon}}
>{{icon}}</span>`;

export const nonIconTemplate = Handlebars.compile(nonIconSource);

const pageIconSource = `<div
class='{{className}} {{inline}} {{isImage}}'>{{{content}}}</div>`;

export const pageIconTemplate = Handlebars.compile(pageIconSource);
