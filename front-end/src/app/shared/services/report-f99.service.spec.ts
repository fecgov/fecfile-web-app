import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { testMockStore } from '../utils/unit-test.utils';
import { ReportF99Service } from './report-f99.service';

describe('ReportF99Service', () => {
  let service: ReportF99Service;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ReportF99Service, provideMockStore(testMockStore)],
    });

    service = TestBed.inject(ReportF99Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
