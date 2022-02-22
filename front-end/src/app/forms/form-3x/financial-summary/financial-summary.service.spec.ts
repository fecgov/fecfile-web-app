import { TestBed, inject } from '@angular/core/testing';

import { FinancialSummaryService } from './financial-summary.service';

xdescribe('FinancialSummaryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FinancialSummaryService],
    });
  });

  xit('should be created', inject([FinancialSummaryService], (service: FinancialSummaryService) => {
    expect(service).toBeTruthy();
  }));
});
