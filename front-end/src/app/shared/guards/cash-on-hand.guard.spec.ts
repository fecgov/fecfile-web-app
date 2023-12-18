import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot } from '@angular/router';
import { provideMockStore } from '@ngrx/store/testing';
import { testMockStore } from '../utils/unit-test.utils';
import { CashOnHandGuard } from './cash-on-hand.guard';

describe('CashOnHandGuard', () => {
  let guard: CashOnHandGuard;
  const mockRoute = {} as ActivatedRouteSnapshot;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [provideMockStore(testMockStore)],
    });
    guard = TestBed.inject(CashOnHandGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should provide status of COH need', () => {
    const result = guard.canActivate(mockRoute);
    expect(result).toBeTruthy();
  });
});
