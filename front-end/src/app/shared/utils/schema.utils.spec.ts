import { AsyncValidatorFn, FormBuilder, ValidationErrors } from '@angular/forms';
import { schema as contactCandidateSchema } from 'fecfile-validate/fecfile_validate_js/dist/Contact_Candidate';
import { schema as f3xSchema } from 'fecfile-validate/fecfile_validate_js/dist/F3X';
import { SchemaUtils } from './schema.utils';
import { SubscriptionFormControl } from './signal-form-control';

describe('ValidateUtils', () => {
  it('#formValidator should validate properties correctly', async () => {
    const fb: FormBuilder = new FormBuilder();
    const formValidatorSchema = contactCandidateSchema;
    const formValidatorForm = fb.group(
      SchemaUtils.getFormGroupFields(SchemaUtils.getSchemaProperties(contactCandidateSchema)),
    );
    formValidatorForm.patchValue({
      telephone: '12345678910',
      candidate_office: 'S',
      last_name: 'Valid Name',
    });

    let validator: AsyncValidatorFn = SchemaUtils.jsonSchemaValidator(
      'telephone',
      formValidatorForm,
      formValidatorSchema,
    );
    let result: ValidationErrors | null = await validator(
      formValidatorForm.get('telephone') as SubscriptionFormControl,
    );
    expect(result).not.toBe(null);
    if (result) {
      expect(result['pattern'].requiredPattern).toBe('^\\+\\d{1,3} \\d{10}$');
    }

    validator = SchemaUtils.jsonSchemaValidator('candidate_state', formValidatorForm, formValidatorSchema);
    result = await validator(formValidatorForm.get('candidate_state') as SubscriptionFormControl);
    expect(result).not.toBe(null);
    if (result) {
      expect(result['required']).toBe(true);
    }

    validator = SchemaUtils.jsonSchemaValidator('last_name', formValidatorForm, formValidatorSchema);
    result = await validator(formValidatorForm.get('last_name') as SubscriptionFormControl);
    expect(result).toBe(null);
  });

  it('#formValidator should validate boolean properties correctly', async () => {
    const fb: FormBuilder = new FormBuilder();
    const formValidatorSchema = f3xSchema;
    const formValidatorForm = fb.group(SchemaUtils.getFormGroupFields(SchemaUtils.getSchemaProperties(f3xSchema)));
    formValidatorForm.patchValue({
      change_of_address: 'A',
    });

    let validator: AsyncValidatorFn = SchemaUtils.jsonSchemaValidator(
      'change_of_address',
      formValidatorForm,
      formValidatorSchema,
    );
    let result: ValidationErrors | null = await validator(
      formValidatorForm.get('change_of_address') as SubscriptionFormControl,
    );
    expect(result).not.toBe(null);
    if (result) {
      expect(result['pattern'].requiredPattern).toBe('must be boolean,null');
    }

    formValidatorForm.patchValue({
      change_of_address: true,
    });
    validator = SchemaUtils.jsonSchemaValidator('change_of_address', formValidatorForm, formValidatorSchema);
    result = await validator(formValidatorForm.get('change_of_address') as SubscriptionFormControl);
    expect(result).toBe(null);
  });

  it('#formValidator should validate min/max numeric properties correctly', async () => {
    const fb: FormBuilder = new FormBuilder();
    const formValidatorSchema = f3xSchema;
    const formValidatorForm = fb.group(SchemaUtils.getFormGroupFields(SchemaUtils.getSchemaProperties(f3xSchema)));
    formValidatorForm.patchValue({
      L6a_cash_on_hand_jan_1_ytd: 1000000000.0,
    });

    let validator: AsyncValidatorFn = SchemaUtils.jsonSchemaValidator(
      'L6a_cash_on_hand_jan_1_ytd',
      formValidatorForm,
      formValidatorSchema,
    );
    let result: ValidationErrors | null = await validator(
      formValidatorForm.get('L6a_cash_on_hand_jan_1_ytd') as SubscriptionFormControl,
    );
    expect(result).not.toEqual(null);
    if (result) {
      expect(result['max'].max).toBe(999999999.99);
    }

    formValidatorForm.patchValue({
      L6a_cash_on_hand_jan_1_ytd: -200.0,
    });
    validator = SchemaUtils.jsonSchemaValidator('L6a_cash_on_hand_jan_1_ytd', formValidatorForm, formValidatorSchema);
    result = await validator(formValidatorForm.get('L6a_cash_on_hand_jan_1_ytd') as SubscriptionFormControl);
    if (result) {
      expect(result['min'].min).toBe(0);
    }
  });

  it('#getSchemaProperties() should return empty array when no schema', () => {
    const properties: string[] = SchemaUtils.getSchemaProperties(undefined);
    expect(properties.length).toBe(0);
  });
});
