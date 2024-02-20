import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { testMockStore } from '../utils/unit-test.utils';
import { Form1MService } from './form-1m.service';

describe('Form99Service', () => {
  let service: Form1MService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [Form1MService, provideMockStore(testMockStore)],
    });

    service = TestBed.inject(Form1MService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
