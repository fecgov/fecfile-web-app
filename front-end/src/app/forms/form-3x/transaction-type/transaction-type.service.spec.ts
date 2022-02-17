import { TestBed, inject } from '@angular/core/testing';

import { TransactionTypeService } from './transaction-type.service';

xdescribe('TransactionTypeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TransactionTypeService],
    });
  });

  xit('should be created', inject([TransactionTypeService], (service: TransactionTypeService) => {
    expect(service).toBeTruthy();
  }));
});
