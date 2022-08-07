import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { JsonSchema } from 'app/shared/interfaces/json-schema.interface';
import { ValidateService } from 'app/shared/services/validate.service';

import { ErrorMessagesComponent } from './error-messages.component';

describe('ErrorMessagesComponent', () => {
  let component: ErrorMessagesComponent;
  let fixture: ComponentFixture<ErrorMessagesComponent>;
  let validateService: ValidateService;

  const testSchema: JsonSchema = {
    $schema: 'http://json-schema.org/draft-07/schema#',
    $id: 'https://unit-test',
    type: 'object',
    required: [],
    properties: {
      in_between: {
        type: 'string',
        minLength: 10,
        maxLength: 20,
      },
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ErrorMessagesComponent],
      providers: [ValidateService],
    }).compileComponents();
  });

  beforeEach(() => {
    validateService = TestBed.inject(ValidateService);
    fixture = TestBed.createComponent(ErrorMessagesComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should provide default error messages', () => {
    validateService.formValidatorSchema = testSchema;
    const fb: FormBuilder = new FormBuilder();
    validateService.formValidatorForm = fb.group(validateService.getFormGroupFields(['in_between']));
    component.form = validateService.formValidatorForm;
    component.fieldName = 'in_between';
    component.ngOnInit();
    component.form.patchValue({ in_between: 'short' });
    expect(component.minLengthErrorMessage).toBe('This field must contain at least 10 alphanumeric characters.');
    component.form.patchValue({ in_between: 'looooooooooooooooooong' });
    expect(component.maxLengthErrorMessage).toBe('This field cannot contain more than 20 alphanumeric characters.');
    component.form.patchValue({ in_between: '' });
    expect(component.requiredErrorMessage).toBe('This is a required field.');
  });

  it('should let us override the error messages', () => {
    component.minLengthErrorMessage = 'My custom min error message';
    expect(component.minLengthErrorMessage).toBe('My custom min error message');
    component.maxLengthErrorMessage = 'My custom max error message';
    expect(component.maxLengthErrorMessage).toBe('My custom max error message');
    component.requiredErrorMessage = 'My custom required error message';
    expect(component.requiredErrorMessage).toBe('My custom required error message');
    component.emailErrorMessage = 'My custom email error message';
    expect(component.emailErrorMessage).toBe('My custom email error message');
    component.patternErrorMessage = 'My custom pattern error message';
    expect(component.patternErrorMessage).toBe('My custom pattern error message');
    component.invalidDateErrorMessage = 'My custom date error message';
    expect(component.invalidDateErrorMessage).toBe('My custom date error message');
    component.minErrorMessage = 'My custom min error message';
    expect(component.minErrorMessage).toBe('My custom min error message');
    component.maxErrorMessage = 'My custom max error message';
    expect(component.maxErrorMessage).toBe('My custom max error message');
  });
});
