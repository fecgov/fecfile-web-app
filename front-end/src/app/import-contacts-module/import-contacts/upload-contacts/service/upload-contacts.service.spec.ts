import { TestBed, inject } from '@angular/core/testing';

import { UploadContactsService } from './upload-contacts.service';

xdescribe('UploadContactsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UploadContactsService],
    });
  });

  xit('should be created', inject([UploadContactsService], (service: UploadContactsService) => {
    expect(service).toBeTruthy();
  }));
});
