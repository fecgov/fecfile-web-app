import { TestBed } from '@angular/core/testing';

import { CashOnHandGuard } from './cash-on-hand.guard';

describe('CashOnHandGuard', () => {
  let guard: CashOnHandGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(CashOnHandGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
