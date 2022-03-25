import { TestBed } from '@angular/core/testing';

import { CommitteeAccountService } from './committee-account.service';

describe('CommitteeAccountService', () => {
  let service: CommitteeAccountService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommitteeAccountService);
  });

  xit('should be created', () => {
    expect(service).toBeTruthy();
  });
});
