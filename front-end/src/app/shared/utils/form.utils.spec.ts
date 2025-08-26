import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { blurActiveInput, printFormErrors } from './form.utils';

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

describe('printFormErrors', () => {
  let fb: FormBuilder;
  let consoleGroupSpy: jasmine.Spy;
  let consoleErrorSpy: jasmine.Spy;

  beforeEach(() => {
    fb = new FormBuilder();
    consoleGroupSpy = spyOn(console, 'group');
    consoleErrorSpy = spyOn(console, 'error');
  });

  it('should log a single error for a simple required field', () => {
    const form = fb.group({
      name: ['', Validators.required],
    });

    form.get('name')?.markAsTouched();
    printFormErrors(form, 'testForm');

    expect(consoleGroupSpy).toHaveBeenCalledWith("Errors for testForm.get('name')");
    expect(consoleErrorSpy).toHaveBeenCalledWith('- Error: required', { value: true });
    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
  });

  it('should log multiple errors for a single control', () => {
    const form = fb.group({
      email: ['abc', [Validators.required, Validators.email, Validators.minLength(5)]],
    });
    form.get('email')?.markAsTouched();
    printFormErrors(form, 'testForm');

    expect(consoleGroupSpy).toHaveBeenCalledWith("Errors for testForm.get('email')");
    expect(consoleErrorSpy).toHaveBeenCalledWith('- Error: email', { value: true });
    expect(consoleErrorSpy).toHaveBeenCalledWith('- Error: minlength', {
      value: { requiredLength: 5, actualLength: 3 },
    });
    expect(consoleErrorSpy).toHaveBeenCalledTimes(2);
  });

  it('should log errors from a nested FormGroup', () => {
    const form = fb.group({
      address: fb.group({
        street: ['', Validators.required],
        city: ['SomeCity'],
      }),
    });
    form.get('address.street')?.markAsTouched();
    printFormErrors(form, 'nestedForm');

    expect(consoleGroupSpy).toHaveBeenCalledWith("Errors for nestedForm.get('address').get('street')");
    expect(consoleErrorSpy).toHaveBeenCalledWith('- Error: required', { value: true });
    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
  });

  it('should log errors from a control within a FormArray', () => {
    const form = fb.group({
      aliases: fb.array([fb.control(''), fb.control('', Validators.required)]),
    });
    form.get('aliases.1')?.markAsTouched();
    printFormErrors(form, 'arrayForm');

    expect(consoleGroupSpy).toHaveBeenCalledWith("Errors for arrayForm.get('aliases').get('1')");
    expect(consoleErrorSpy).toHaveBeenCalledWith('- Error: required', { value: true });
  });

  it('should not log anything if the form is valid', () => {
    const form = fb.group({
      name: ['Valid Name', Validators.required],
      email: ['test@example.com', Validators.email],
    });
    printFormErrors(form, 'validForm');

    expect(consoleGroupSpy).not.toHaveBeenCalled();
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it('should handle deeply nested form groups correctly', () => {
    const form = fb.group({
      level1: fb.group({
        level2: fb.group({
          level3: ['', Validators.pattern('abc')],
        }),
      }),
    });
    form.get('level1.level2.level3')?.setValue('def');
    printFormErrors(form, 'deepForm');

    expect(consoleGroupSpy).toHaveBeenCalledWith("Errors for deepForm.get('level1').get('level2').get('level3')");
    expect(consoleErrorSpy).toHaveBeenCalledWith('- Error: pattern', {
      value: { requiredPattern: '^abc$', actualValue: 'def' },
    });
  });
});
