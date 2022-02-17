import { TestBed, inject } from '@angular/core/testing';

import { TwoFactorHelperService } from './two-factor-helper.service';

xdescribe('TwoFactorHelperService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TwoFactorHelperService],
    });
  });

  xit('should be created', inject([TwoFactorHelperService], (service: TwoFactorHelperService) => {
    expect(service).toBeTruthy();
  }));
});
