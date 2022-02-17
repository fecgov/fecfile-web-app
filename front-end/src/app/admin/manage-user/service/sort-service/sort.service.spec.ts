import { TestBed, inject } from '@angular/core/testing';

import { SortService } from './sort.service';

xdescribe('SortService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SortService],
    });
  });

  xit('should be created', inject([SortService], (service: SortService) => {
    expect(service).toBeTruthy();
  }));
});
