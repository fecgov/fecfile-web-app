import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { testMockStore } from '../utils/unit-test.utils';
import { Form99Service } from './form-99.service';

describe('Form99Service', () => {
  let service: Form99Service;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [Form99Service, provideMockStore(testMockStore)],
    });

    service = TestBed.inject(Form99Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
