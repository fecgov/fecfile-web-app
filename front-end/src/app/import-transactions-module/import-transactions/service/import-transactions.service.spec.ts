import { TestBed, inject } from '@angular/core/testing';

import { ImportTransactionsService } from './import-transactions.service';

xdescribe('ImportTransactionsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ImportTransactionsService],
    });
  });

  xit('should be created', inject([ImportTransactionsService], (service: ImportTransactionsService) => {
    expect(service).toBeTruthy();
  }));
});
