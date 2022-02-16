import { TestBed, inject } from '@angular/core/testing';

import { TwoFactorGuardGuard } from './two-factor-guard.guard';

xdescribe('TwoFactorGuardGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TwoFactorGuardGuard],
    });
  });

  xit('should ...', inject([TwoFactorGuardGuard], (guard: TwoFactorGuardGuard) => {
    expect(guard).toBeTruthy();
  }));
});
