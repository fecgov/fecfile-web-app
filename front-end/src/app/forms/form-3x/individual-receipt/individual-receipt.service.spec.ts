import { TestBed, inject } from '@angular/core/testing';

import { IndividualReceiptService } from './individual-receipt.service';

xdescribe('IndividualReceiptService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IndividualReceiptService],
    });
  });

  xit('should be created', inject([IndividualReceiptService], (service: IndividualReceiptService) => {
    expect(service).toBeTruthy();
  }));
});
