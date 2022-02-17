import { TestBed, inject } from '@angular/core/testing';

import { TimeoutMessageService } from './timeout-message-service.service';

xdescribe('TimeoutMessageServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TimeoutMessageService],
    });
  });

  xit('should be created', inject([TimeoutMessageService], (service: TimeoutMessageService) => {
    expect(service).toBeTruthy();
  }));
});
