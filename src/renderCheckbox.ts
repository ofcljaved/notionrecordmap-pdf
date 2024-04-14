import {
  checkboxTemplate,
  checkedTemplate,
  uncheckedTemplate,
} from './handlebars/checkbox';

interface RenderCheckboxProps {
  isChecked: boolean;
}
export function renderCheckbox({ isChecked }: RenderCheckboxProps) {
  let content = '';

  if (isChecked) {
    content = checkedTemplate({});
  } else {
    content = uncheckedTemplate({});
  }

  return checkboxTemplate({ content });
}
