import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { ReportIsEditableGuard } from './report-is-editable.guards';

describe('ReportIsEditableGuard', () => {
  let guard: ReportIsEditableGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore({
          initialState: { },
          selectors: [],
        }),
      ],
    });
    guard = TestBed.inject(ReportIsEditableGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should provide status of COH need', () => {
    const result = guard.canActivate();
    expect(result).toBeTruthy();
  });
});
