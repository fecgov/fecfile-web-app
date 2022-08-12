import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot } from '@angular/router';
import { provideMockStore } from '@ngrx/store/testing';
import { selectCashOnHand } from '../../store/cash-on-hand.selectors';
import { selectActiveReport } from 'app/store/active-report.selectors';
import { CashOnHandGuard } from './cash-on-hand.guard';

describe('CashOnHandGuard', () => {
  let guard: CashOnHandGuard;
  const mockRoute = {} as ActivatedRouteSnapshot;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore({
          initialState: { fecfile_online_activeReport: null, fecfile_online_cohNeeded: false },
          selectors: [
            { selector: selectActiveReport, value: { id: 999 } },
            { selector: selectCashOnHand, value: { report_id: 999, value: 100.0 } },
          ],
        }),
      ],
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
