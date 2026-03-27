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

  describe('F24UniqueNameValidator Coverage', () => {
    it('should return required error if any name part is missing', async () => {
      const scenarios = [
        { type: '', form: 'REPORT' },
        { type: '24 HOUR', form: '' },
        { type: '', form: '' },
      ];

      for (const scenario of scenarios) {
        const control = new FormGroup({
          typeName: new FormControl(scenario.type),
          form24Name: new FormControl(scenario.form),
        });
        const result = await validator.validate(control);
        expect(result).toEqual({ required: true });
      }
    });

    it('should handle null/undefined reports or names', async () => {
      const form24 = Form24.fromJSON({ name: null });
      vi.spyOn(service, 'getAllReports').mockResolvedValue([form24]);

      const control = new FormGroup({
        typeName: new FormControl('NEW'),
        form24Name: new FormControl('REPORT'),
      });

      const result = await validator.validate(control);
      expect(result).toBeNull();
    });
  });
});
