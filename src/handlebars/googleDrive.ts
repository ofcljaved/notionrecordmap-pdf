import Handlebars from 'handlebars';

const titleSource = `<div class='notion-google-drive-body-title'>{{title}}</div>`;

export const titleTemplate = Handlebars.compile(titleSource);

const iconSource = `<div class='notion-google-drive-body-source-icon' style= 'background-image: url({{icon}})'></div`;

export const iconTemplate = Handlebars.compile(iconSource);

const domainSource = `<div class='notion-google-drive-body-source-domain'>{{domain}}</div>`;

export const domainTemplate = Handlebars.compile(domainSource);

const driveBodySource = `<div class='notion-google-drive-body-source'>{{{icon}}}{{{domainSource}}}</div>`;

export const driveBodyTemplate = Handlebars.compile(driveBodySource);

const driveSource = `<div class='notion-google-drive {{blockId}}'><a class='notion-google-drive-link' href={{url}} target='_blank' rel='noopener noreferrer'><div class='notion-google-drive-preview'><img src={{src}} alt={{alt}} /></div><div class='notion-google-drive-body'>{{{title}}}{{{driveBody}}}</div></a></div>`;

export const driveTemplate = Handlebars.compile(driveSource);
