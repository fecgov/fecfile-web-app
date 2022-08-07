import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { selectCohNeededStatus } from '../../store/coh-needed.selectors';
import { CashOnHandGuard } from './cash-on-hand.guard';

describe('CashOnHandGuard', () => {
  let guard: CashOnHandGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore({
          initialState: { fecfile_online_cohNeeded: false },
          selectors: [{ selector: selectCohNeededStatus, value: true }],
        }),
      ],
    });
    guard = TestBed.inject(CashOnHandGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
