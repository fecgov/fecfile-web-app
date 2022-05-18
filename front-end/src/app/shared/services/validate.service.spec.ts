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
      service.getFormGroupFields(service.getSchemaProperties(contactCandidateSchema))
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
      expect(result['maxlength'].requiredLength).toBe(10);
      expect(result['pattern'].requiredPattern).toBe('^\\d{10}$');
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

  it('#formValidator should validate enum properties correctly', () => {
    const fb: FormBuilder = new FormBuilder();
    service.formValidatorSchema = f3xSchema;
    service.formValidatorForm = fb.group(service.getFormGroupFields(service.getSchemaProperties(f3xSchema)));
    service.formValidatorForm.patchValue({
      change_of_address: 'A',
    });

    let validator: ValidatorFn = service.formValidator('change_of_address');
    let result: ValidationErrors | null = validator(service.formValidatorForm.get('change_of_address') as FormControl);
    expect(result).not.toBe(null);
    if (result) {
      expect(result['pattern'].requiredPattern).toBe('Allowed values: X, ');
    }

    service.formValidatorForm.patchValue({
      change_of_address: 'X',
    });
    validator = service.formValidator('change_of_address');
    result = validator(service.formValidatorForm.get('change_of_address') as FormControl);
    expect(result).toBe(null);
  });

  it('#getSchemaProperties() should return empty array when no schema', () => {
    const properties: string[] = service.getSchemaProperties(null);
    expect(properties.length).toBe(0);
  });
});
