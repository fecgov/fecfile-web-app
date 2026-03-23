import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { testMockStore } from '../utils/unit-test.utils';
import { F24UniqueNameValidator, Form24Service } from './form-24.service';
import { provideHttpClient } from '@angular/common/http';
import { FormGroup, FormControl } from '@angular/forms';
import { Form24 } from '../models';

describe('Form24Service', () => {
  let service: Form24Service;
  let validator: F24UniqueNameValidator;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        Form24Service,
        F24UniqueNameValidator,
        provideMockStore(testMockStore()),
      ],
    });

    service = TestBed.inject(Form24Service);
    validator = TestBed.inject(F24UniqueNameValidator);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('F24UniqueNameValidator', () => {
    it('should return error if name is duplicate', async () => {
      const report = Form24.fromJSON({ name: '24 hourreport' });
      vi.spyOn(service, 'getAllReports').mockResolvedValue([report]);
      const control = new FormGroup({
        typeName: new FormControl('24 HOUR'),
        form24Name: new FormControl('REPORT'),
      });
      const result = await validator.validate(control);
      expect(result).toEqual({ duplicateName: true });
    });

    it('should return null if name is unique', async () => {
      vi.spyOn(service, 'getAllReports').mockResolvedValue([]);
      const control = new FormGroup({
        typeName: new FormControl('24 HOUR'),
        form24Name: new FormControl('REPORT'),
      });
      const result = await validator.validate(control);
      expect(result).toBeNull();
    });

    it('should return required error if typeName is missing', async () => {
      const control = new FormGroup({
        typeName: new FormControl(''),
        form24Name: new FormControl('REPORT'),
      });

      const result = await validator.validate(control);
      expect(result).toEqual({ required: true });
    });

    it('should return required error if form24Name is missing', async () => {
      const control = new FormGroup({
        typeName: new FormControl('24 HOUR'),
        form24Name: new FormControl(''),
      });

      const result = await validator.validate(control);
      expect(result).toEqual({ required: true });
    });

    it('should handle reports with null/missing names gracefully', async () => {
      const mockReports = [{ name: null } as unknown as Form24, Form24.fromJSON({ name: 'existing' })];
      vi.spyOn(service, 'getAllReports').mockResolvedValue(mockReports);

      const control = new FormGroup({
        typeName: new FormControl('NEW'),
        form24Name: new FormControl('REPORT'),
      });

      const result = await validator.validate(control);
      expect(result).toBeNull();
    });

    it('should return null if control gets return null for sub-controls', async () => {
      const control = new FormGroup({}); 
      const result = await validator.validate(control);
      expect(result).toEqual({ required: true });
    });
  });
});
