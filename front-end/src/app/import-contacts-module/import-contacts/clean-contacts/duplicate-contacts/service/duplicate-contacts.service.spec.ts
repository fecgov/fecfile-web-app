import { TestBed, inject } from '@angular/core/testing';

import { DuplicateContactsService } from './duplicate-contacts.service';

xdescribe('DuplicateContactsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DuplicateContactsService],
    });
  });

  xit('should be created', inject([DuplicateContactsService], (service: DuplicateContactsService) => {
    expect(service).toBeTruthy();
  }));
});
