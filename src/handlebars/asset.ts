import Handlebars from 'handlebars';

const figureSource = `
<figure class='notion-asset-wrapper notion-asset-wrapper-{{type}} {{fullWidth}} {{blockId}}'>{{{assets}}}</figure>
`;

export const figureTemplate = Handlebars.compile(figureSource);

const urlSource = `
<a style='width:100%;' href={{href}} target='blank_'>{{figure}}</a>
`;

export const urlTemplate = Handlebars.compile(urlSource);

const figCaptionSource = `
<figcaption class='notion-asset-caption'>{{{renderText}}}</figcaption>
`;

export const figCaptionTemplate = Handlebars.compile(figCaptionSource);

const tweetSource = `<div style="{{divStyle}}"><div data-id="{{id}}">Tweet are not supported</div></div>`;

export const tweetTemplate = Handlebars.compile(tweetSource);

const pdfSource = `<div>PDF {{source}} are not supported<div>`;

export const pdfTemplate = Handlebars.compile(pdfSource);

const embedVideoSource = `<div>Youtube Video {{src}} are not supported</div>`;

export const embedVideoTemplate = Handlebars.compile(embedVideoSource);

const videoSource = `<div>Video title:{{type}} {{source}} are not supported</div>`;

export const videoTemplate = Handlebars.compile(videoSource);

const gistSource = `<iframe style="{{gistStyle}}" class='notion-asset-object-fit' src="{{src}}"  title='GitHub Gist' frameBorder='0'allow-forms  allow-same-origin' scrolling='auto'/>`;

export const gistTemplate = Handlebars.compile(gistSource);

const formSource = `<iframe class='notion-asset-object-fit' style="{{gistStyle}}" src="{{src}}" title="iframe {{type}}" frameBorder='0' allowFullScreen scrolling='auto'/>`;

export const formTemplate = Handlebars.compile(formSource);

const imgSource = `<img src="{{src}}" alt="{{alt}}" height="{{height}}" style="{{imgStyle}}" />`;

export const imgTemplate = Handlebars.compile(imgSource);

const assetSource = `<div style="{{divStyle}}">{{{content}}}{{{imgChildren}}}</div>{{{children}}}`;

export const assetTemplate = Handlebars.compile(assetSource);
