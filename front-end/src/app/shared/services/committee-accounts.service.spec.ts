import { TestBed } from '@angular/core/testing';

import { CommitteeAccountsService } from './committee-accounts.service';

describe('CommitteeAccountsService', () => {
  let service: CommitteeAccountsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommitteeAccountsService);
  });

  xit('should be created', () => {
    expect(service).toBeTruthy();
  });
});
