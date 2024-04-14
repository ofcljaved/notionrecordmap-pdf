import Handlebars from 'handlebars';

const eoiSource = `<a target='_blank' rel='noopener noreferrer' href={{original_url}} class='notion-external {{inline}} {{className}}'><div class='notion-external-image'><img alt={{title}}/></div><div class='notion-external-description'><div class='notion-external-title'>{{title}}</div></div></a>
`;

export const eoiTemplate = Handlebars.compile(eoiSource);
