import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, convertToParamMap } from '@angular/router';
import { provideMockStore } from '@ngrx/store/testing';
import { testMockStore } from '../utils/unit-test.utils';
import { ReportIsEditableGuard } from './report-is-editable.guard';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('ReportIsEditableGuard', () => {
  let guard: ReportIsEditableGuard;
  const mockRoute = {
    paramMap: convertToParamMap({ reportId: '999' }),
  } as ActivatedRouteSnapshot;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), provideMockStore(testMockStore())],
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
