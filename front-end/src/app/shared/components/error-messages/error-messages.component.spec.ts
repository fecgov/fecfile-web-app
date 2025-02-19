import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { SchemaUtils } from 'app/shared/utils/schema.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/UNIT_TEST';

import { SubscriptionFormControl } from 'app/shared/utils/subscription-form-control';
import { ErrorMessagesComponent } from './error-messages.component';

describe('ErrorMessagesComponent', () => {
  let component: ErrorMessagesComponent;
  let fixture: ComponentFixture<ErrorMessagesComponent>;

  beforeAll(async () => {
    await import(`fecfile-validate/fecfile_validate_js/dist/UNIT_TEST.validator.js`);
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ErrorMessagesComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorMessagesComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should provide default error messages', fakeAsync(() => {
    const fb: FormBuilder = new FormBuilder();
    const formValidatorForm = fb.group(
      SchemaUtils.getFormGroupFields(['in_between', 'low_high', 'exclusive_low_high', 'exclusive_negative_amount']),
    );
    SchemaUtils.addJsonSchemaValidators(formValidatorForm, schema, false);
    component.form = formValidatorForm;
    component.fieldName = 'in_between';
    component.ngOnInit();
    component.form.patchValue({ in_between: 'short' });
    tick(100);
    expect(component.minLengthErrorMessage).toBe('This field must contain at least 10 alphanumeric characters.');

    component.form.patchValue({ in_between: 'looooooooooooooooooong' });
    tick(100);
    expect(component.maxLengthErrorMessage).toBe('This field cannot contain more than 20 alphanumeric characters.');

    component.form.patchValue({ in_between: '' });
    tick(100);
    expect(component.requiredErrorMessage).toBe('This is a required field.');
    expect(component.requiredTrueErrorMessage).toBe('This is a required field.');

    component.fieldName = 'low_high';
    component.control = undefined;
    component.ngOnInit();
    component.form.patchValue({ low_high: -100 });
    tick(100);
    expect(component.minErrorMessage).toBe('This field must be greater than or equal to $0.00.');

    component.form.patchValue({ low_high: 100 });
    tick(100);
    expect(component.maxErrorMessage).toBe('This field must be less than or equal to $10.00.');

    component.fieldName = 'exclusive_low_high';
    component.control = undefined;
    component.ngOnInit();
    component.form.patchValue({ exclusive_low_high: 0 });
    tick(100);
    expect(component.exclusiveMinErrorMessage).toBe('This field must be greater than $0.00.');

    component.form.patchValue({ exclusive_low_high: 100 });
    tick(100);
    expect(component.exclusiveMaxErrorMessage).toBe('This field must be less than $100.00.');
  }));

  it('should present a unique error message when a negative contribution amount is required', fakeAsync(() => {
    //This has to be done separately because a new exclusiveMaxErrorMessage has to be generated
    const fb: FormBuilder = new FormBuilder();
    const formValidatorForm = fb.group(SchemaUtils.getFormGroupFields(['exclusive_negative_amount']));
    SchemaUtils.addJsonSchemaValidators(formValidatorForm, schema, false);
    component.form = formValidatorForm;
    component.fieldName = 'exclusive_negative_amount';
    component.ngOnInit();
    component.form.patchValue({ exclusive_negative_amount: 1 });
    tick(100);
    expect(component.exclusiveMaxErrorMessage).toBe('Amount must be negative (example: -$20.00)');
  }));

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
    component.exclusiveMaxErrorMessage = 'My custom exclusive max error message';
    expect(component.exclusiveMaxErrorMessage).toBe('My custom exclusive max error message');
    component.exclusiveMinErrorMessage = 'My custom exclusive min error message';
    expect(component.exclusiveMinErrorMessage).toBe('My custom exclusive min error message');
  });

  it('should use a form control passed to it before using a named one passed as Input', () => {
    const fb: FormBuilder = new FormBuilder();
    const form = fb.group({});
    component.form = form;
    component.control = new SubscriptionFormControl('my control');
    component.ngOnInit();
    expect(component.control?.value).toBe('my control');
  });
});
