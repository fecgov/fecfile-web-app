import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { testMockStore } from '../utils/unit-test.utils';
import { ReportF24Service } from './report-f24.service';

describe('ReportF24Service', () => {
  let service: ReportF24Service;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ReportF24Service, provideMockStore(testMockStore)],
    });

    service = TestBed.inject(ReportF24Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
