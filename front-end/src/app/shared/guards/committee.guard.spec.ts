import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { committeeGuard } from './committee.guard';

describe('committeeGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => committeeGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
