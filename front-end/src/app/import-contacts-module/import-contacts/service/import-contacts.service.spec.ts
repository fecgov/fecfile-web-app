import { TestBed, inject } from '@angular/core/testing';

import { ImportContactsService } from './import-contacts.service';

xdescribe('ImportContactsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ImportContactsService],
    });
  });

  xit('should be created', inject([ImportContactsService], (service: ImportContactsService) => {
    expect(service).toBeTruthy();
  }));
});
