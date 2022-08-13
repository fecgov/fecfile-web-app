import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot } from '@angular/router';
import { provideMockStore } from '@ngrx/store/testing';
import { ReportIsEditableGuard } from './report-is-editable.guard';

describe('ReportIsEditableGuard', () => {
  let guard: ReportIsEditableGuard;
  const mockRoute = {} as ActivatedRouteSnapshot;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore({
          initialState: {},
          selectors: [],
        }),
      ],
    });
    guard = TestBed.inject(ReportIsEditableGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should provide result from CanActivate', () => {
    const result = guard.canActivate(mockRoute);
    expect(result).toBeTruthy();
  });
});
