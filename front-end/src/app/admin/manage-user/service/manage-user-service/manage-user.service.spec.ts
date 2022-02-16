import { TestBed, inject } from '@angular/core/testing';

import { ManageUserService } from './manage-user.service';

xdescribe('ManageUserService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ManageUserService],
    });
  });

  xit('should be created', inject([ManageUserService], (service: ManageUserService) => {
    expect(service).toBeTruthy();
  }));
});
