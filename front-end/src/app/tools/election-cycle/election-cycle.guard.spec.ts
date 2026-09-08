import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { electionCycleGuard } from './election-cycle.guard';

describe('electionCycleGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => electionCycleGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
