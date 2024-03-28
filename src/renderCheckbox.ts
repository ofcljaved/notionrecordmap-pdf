interface RenderCheckboxProps {
  isChecked: boolean;
}
export function renderCheckbox({ isChecked }: RenderCheckboxProps) {
  let content = '';

  if (isChecked) {
    content = `
      <div class='notion-property-checkbox-checked'>
        <svg viewBox='0 0 14 14'>
          <path d='M5.5 12L14 3.5 12.5 2l-7 7-4-4.003L0 6.499z' />
        </svg>
      </div>
    `;
  } else {
    content = `<div class='notion-property-checkbox-unchecked' />`;
  }

  return `
    <span class='notion-property notion-property-checkbox'>${content}</span>
  `;
}
