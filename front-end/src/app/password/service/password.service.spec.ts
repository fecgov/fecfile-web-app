import { TestBed, inject } from '@angular/core/testing';

import { PasswordService } from './password.service';

xdescribe('PasswordService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PasswordService],
    });
  });

  xit('should be created', inject([PasswordService], (service: PasswordService) => {
    expect(service).toBeTruthy();
  }));
});
