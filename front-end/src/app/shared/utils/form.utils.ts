import { FormArray, FormGroup } from '@angular/forms';

export function blurActiveInput(form: FormGroup) {
  const activeElement = document.activeElement;
  if (activeElement && activeElement.tagName === 'INPUT') {
    (activeElement as HTMLElement).blur();
  }
  form.updateValueAndValidity();
}

export function scrollToTop() {
  window.scrollTo({ top: 0 });
}

export function printFormErrors(form: FormGroup | FormArray, formName: string = 'form') {
  Object.keys(form.controls).forEach((key) => {
    const control = form.get(key);

    if (control instanceof FormGroup || control instanceof FormArray) {
      printFormErrors(control, `${formName}.get('${key}')`);
    } else if (control?.errors) {
      const controlName = `${formName}.get('${key}')`;
      console.group(`Errors for ${controlName}`);
      Object.keys(control.errors).forEach((errorKey) => {
        console.error(`- Error: ${errorKey}`, {
          value: control.errors ? control.errors[errorKey] : 'N/A',
        });
      });
      console.groupEnd();
    }
  });
}
