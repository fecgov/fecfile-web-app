import { TestBed, inject } from '@angular/core/testing';

import { MessageService } from './message.service';

xdescribe('MessageService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MessageService],
    });
  });

  xit('should be created', inject([MessageService], (service: MessageService) => {
    expect(service).toBeTruthy();
  }));
});
