import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot } from '@angular/router';
import { provideMockStore } from '@ngrx/store/testing';
import { ReportIsEditableGuard } from './report-is-editable.guard';
import { HttpClientTestingModule } from '@angular/common/http/testing';

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
      imports: [HttpClientTestingModule],
    });
    guard = TestBed.inject(ReportIsEditableGuard);
  });

  xit('should be created', () => {
    expect(guard).toBeTruthy();
  });

  xit('should provide result from CanActivate', () => {
    const result = guard.canActivate(mockRoute);
    expect(result).toBeTruthy();
  });
});
