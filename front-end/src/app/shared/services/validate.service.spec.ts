import { TestBed } from '@angular/core/testing';
import { FormBuilder, ValidationErrors, ValidatorFn, FormControl } from '@angular/forms';
import { schema as contactCandidateSchema } from 'fecfile-validate/fecfile_validate_js/dist/Contact_Candidate';
import { schema as f3xSchema } from 'fecfile-validate/fecfile_validate_js/dist/F3X';
import { ValidateService } from './validate.service';

describe('ValidateService', () => {
  let service: ValidateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ValidateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#formValidator should validate properties correctly', () => {
    const fb: FormBuilder = new FormBuilder();
    service.formValidatorSchema = contactCandidateSchema;
    service.formValidatorForm = fb.group(
      service.getFormGroupFields(ValidateService.getSchemaProperties(contactCandidateSchema))
    );
    service.formValidatorForm.patchValue({
      telephone: '12345678910',
      candidate_office: 'S',
      last_name: 'Valid Name',
    });

    let validator: ValidatorFn = service.formValidator('telephone');
    let result: ValidationErrors | null = validator(service.formValidatorForm.get('telephone') as FormControl);
    expect(result).not.toBe(null);
    if (result) {
      expect(result['pattern'].requiredPattern).toBe('^\\+\\d{1,3} \\d{10}$');
    }

    validator = service.formValidator('candidate_state');
    result = validator(service.formValidatorForm.get('candidate_state') as FormControl);
    expect(result).not.toBe(null);
    if (result) {
      expect(result['required']).toBe(true);
    }

    validator = service.formValidator('last_name');
    result = validator(service.formValidatorForm.get('last_name') as FormControl);
    expect(result).toBe(null);
  });

  it('#formValidator should validate boolean properties correctly', () => {
    const fb: FormBuilder = new FormBuilder();
    service.formValidatorSchema = f3xSchema;
    service.formValidatorForm = fb.group(service.getFormGroupFields(ValidateService.getSchemaProperties(f3xSchema)));
    service.formValidatorForm.patchValue({
      change_of_address: 'A',
    });

    let validator: ValidatorFn = service.formValidator('change_of_address');
    let result: ValidationErrors | null = validator(service.formValidatorForm.get('change_of_address') as FormControl);
    expect(result).not.toBe(null);
    if (result) {
      expect(result['pattern'].requiredPattern).toBe('must be boolean,null');
    }

    service.formValidatorForm.patchValue({
      change_of_address: true,
    });
    validator = service.formValidator('change_of_address');
    result = validator(service.formValidatorForm.get('change_of_address') as FormControl);
    expect(result).toBe(null);
  });

  it('#formValidator should validate min/max numeric properties correctly', () => {
    const fb: FormBuilder = new FormBuilder();
    service.formValidatorSchema = f3xSchema;
    service.formValidatorForm = fb.group(service.getFormGroupFields(ValidateService.getSchemaProperties(f3xSchema)));
    service.formValidatorForm.patchValue({
      L6a_cash_on_hand_jan_1_ytd: 1000000000.0,
    });

    let validator: ValidatorFn = service.formValidator('L6a_cash_on_hand_jan_1_ytd');
    let result: ValidationErrors | null = validator(
      service.formValidatorForm.get('L6a_cash_on_hand_jan_1_ytd') as FormControl
    );
    expect(result).not.toEqual(null);
    if (result) {
      expect(result['max'].max).toBe(999999999.99);
    }

    service.formValidatorForm.patchValue({
      L6a_cash_on_hand_jan_1_ytd: -200.0,
    });
    validator = service.formValidator('L6a_cash_on_hand_jan_1_ytd');
    result = validator(service.formValidatorForm.get('L6a_cash_on_hand_jan_1_ytd') as FormControl);
    if (result) {
      expect(result['min'].min).toBe(0);
    }
  });

  it('#getSchemaProperties() should return empty array when no schema', () => {
    const properties: string[] = ValidateService.getSchemaProperties(undefined);
    expect(properties.length).toBe(0);
  });
});
