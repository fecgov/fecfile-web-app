import { TestBed } from '@angular/core/testing';

import { ContactManagementService } from './contact-management.service';

describe('ContactManagementService', () => {
  let service: ContactManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContactManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
