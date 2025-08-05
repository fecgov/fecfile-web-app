import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { testMockStore } from '../utils/unit-test.utils';
import { Form24Service } from './form-24.service';
import { provideHttpClient } from '@angular/common/http';

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
