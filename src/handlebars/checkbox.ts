import Handlebars from 'handlebars';

const checkboxSource = `
<span class='notion-property notion-property-checkbox'>{{{content}}}</span>
`;

export const checkboxTemplate = Handlebars.compile(checkboxSource);

const checkedSource = `<div class='notion-property-checkbox-checked'><svg viewBox='0 0 14 14'><path d='M5.5 12L14 3.5 12.5 2l-7 7-4-4.003L0 6.499z' /></svg></div>`;

export const checkedTemplate = Handlebars.compile(checkedSource);

const uncheckedSource = `<div class='notion-property-checkbox-unchecked' />`;

export const uncheckedTemplate = Handlebars.compile(uncheckedSource);
