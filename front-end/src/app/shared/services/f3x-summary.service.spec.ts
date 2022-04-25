import { TestBed } from '@angular/core/testing';

import { F3xSummaryService } from './f3x-summary.service';

describe('F3xSummaryService', () => {
  let service: F3xSummaryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(F3xSummaryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
