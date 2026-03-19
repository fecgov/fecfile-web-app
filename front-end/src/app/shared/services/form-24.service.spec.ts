import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { testMockStore } from '../utils/unit-test.utils';
import { F24UniqueNameValidator, Form24Service } from './form-24.service';
import { provideHttpClient } from '@angular/common/http';
import { FormGroup, FormControl } from '@angular/forms';
import type { MockedObject } from 'vitest';
import { Form24 } from '../models';

describe('Form24Service', () => {
  let service: Form24Service;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), Form24Service, provideMockStore(testMockStore())],
    });

    service = TestBed.inject(Form24Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

describe('F24UniqueNameValidator', () => {
  let service: MockedObject<Form24Service>;
  let validator: F24UniqueNameValidator;

  beforeEach(() => {
    const spy = {
      getAllReports: vi.fn().mockName('Form24Service.getAllReports'),
    };
    TestBed.configureTestingModule({
      providers: [F24UniqueNameValidator, { provide: Form24Service, useValue: spy }],
    });
    service = TestBed.inject(Form24Service) as MockedObject<Form24Service>;
    validator = TestBed.inject(F24UniqueNameValidator);
  });

  it('should return error if name is duplicate', async () => {
    const report = Form24.fromJSON({ name: '24 hourreport' });
    service.getAllReports.mockResolvedValue([report]);
    const control = new FormGroup({
      typeName: new FormControl('24 HOUR'),
      form24Name: new FormControl('REPORT'),
    });
    const result = await validator.validate(control);
    expect(result).toEqual({ duplicateName: true });
  });

  it('should return null if name is unique', async () => {
    service.getAllReports.mockResolvedValue([]);
    const control = new FormGroup({
      typeName: new FormControl('24 HOUR'),
      form24Name: new FormControl('REPORT'),
    });
    const result = await validator.validate(control);
    expect(result).toBeNull();
  });
});
