import { FormArray, FormControl, FormGroup } from '@angular/forms';

export type PendingChangeFormControl = FormControl & {
  _pendingChange?: boolean;
  _pendingDirty?: boolean;
  _pendingValue?: unknown;
};

function syncPendingControlValues(form: FormGroup | FormArray) {
  Object.values(form.controls).forEach((control) => {
    if (control instanceof FormGroup || control instanceof FormArray) {
      syncPendingControlValues(control);
    } else if (control instanceof FormControl) {
      const ctrl = control as PendingChangeFormControl;
      if (ctrl._pendingChange) {
        if (ctrl._pendingDirty) ctrl.markAsDirty();
        ctrl.setValue(ctrl._pendingValue, { onlySelf: true, emitModelToViewChange: false });
        if (ctrl.updateOn !== 'submit') ctrl.markAsTouched();
        ctrl._pendingChange = false;
      }
    }
  });
}

export function blurActiveInput(form: FormGroup) {
  const activeElement = document.activeElement;
  if (activeElement instanceof HTMLElement && activeElement !== document.body) {
    activeElement.blur();
  }
  syncPendingControlValues(form);
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
