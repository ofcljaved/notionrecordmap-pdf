import Handlebars from 'handlebars';

const fileSource = `<div class='notion-file {{blockId}}'>
<a class='notion-file-link' href={{source} target='_blank' rel='noopener noreferrer'><svg class='notion-file-icon' viewBox='0 0 30 30'><path d='M22,8v12c0,3.866-3.134,7-7,7s-7-3.134-7-7V8c0-2.762,2.238-5,5-5s5,2.238,5,5v12c0,1.657-1.343,3-3,3s-3-1.343-3-3V8h-2v12c0,2.762,2.238,5,5,5s5-2.238,5-5V8c0-3.866-3.134-7-7-7S6,4.134,6,8v12c0,4.971,4.029,9,9,9s9-4.029,9-9V8H22z'></path></svg><div class='notion-file-info'><div class='notion-file-title'>{{{text}}}</div>{{{children}}}</div></a></div>`;

export const fileTemplate = Handlebars.compile(fileSource);

const fileChildrenSource = `<div class='notion-file-size'>{{{text}}}</div>`;

export const fileChildrenTemplate = Handlebars.compile(fileChildrenSource);
