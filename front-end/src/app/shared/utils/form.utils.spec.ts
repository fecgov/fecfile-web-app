import { FormGroup } from '@angular/forms';
import { blurActiveInput } from './form.utils';

describe('blurActiveInput', () => {
  let form: FormGroup;

  beforeEach(() => {
    form = new FormGroup({}, { updateOn: 'blur' });
    spyOn(form, 'updateValueAndValidity');
  });

  it('should blur the active input element and update form validity', () => {
    const inputElement = document.createElement('input');
    document.body.appendChild(inputElement);
    inputElement.focus();

    blurActiveInput(form);

    expect(document.activeElement).not.toBe(inputElement);
    expect(form.updateValueAndValidity).toHaveBeenCalled();

    document.body.removeChild(inputElement);
  });

  it('should not throw an error if there is no active input element', () => {
    const divElement = document.createElement('div');
    document.body.appendChild(divElement);
    divElement.focus();

    blurActiveInput(form);

    expect(form.updateValueAndValidity).toHaveBeenCalled();

    document.body.removeChild(divElement);
  });
});
