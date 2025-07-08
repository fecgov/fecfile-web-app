import { FormGroup } from '@angular/forms';

export function blurActiveInput(form: FormGroup) {
  const activeElement = document.activeElement;
  if (activeElement && activeElement.tagName === 'INPUT') {
    (activeElement as HTMLElement).blur();
  }
  form.updateValueAndValidity();
}

export function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
}
