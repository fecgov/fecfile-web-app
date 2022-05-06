import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { F3xSummaryService } from '../services/f3x-summary.service';
import { ReportResolver } from './report.resolver';

describe('ReportResolver', () => {
  let resolver: ReportResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [F3xSummaryService, provideMockStore({})],
    });
    resolver = TestBed.inject(ReportResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
