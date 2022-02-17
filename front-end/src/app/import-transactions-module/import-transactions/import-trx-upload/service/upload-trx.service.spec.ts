import { TestBed, inject } from '@angular/core/testing';

import { UploadTrxService } from './upload-trx.service';

xdescribe('UploadTrxService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UploadTrxService],
    });
  });

  xit('should be created', inject([UploadTrxService], (service: UploadTrxService) => {
    expect(service).toBeTruthy();
  }));
});
