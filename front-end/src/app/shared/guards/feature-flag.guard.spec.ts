/* eslint-disable @typescript-eslint/no-explicit-any */
import { TestBed } from '@angular/core/testing';
import { featureFlagGuard } from './feature-flag.guard';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlCreationOptions, UrlTree } from '@angular/router';
import { environment } from 'environments/environment';
import { Mock } from 'vitest';

describe('featureFlagGuard', () => {
  let createUrlSpy: Mock<(commands: readonly any[], navigationExtras?: UrlCreationOptions) => UrlTree>;
  const mockRoute = {} as ActivatedRouteSnapshot;
  const mockState = {} as RouterStateSnapshot;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Router],
    });
    const router = TestBed.inject(Router);

    createUrlSpy = vi.spyOn(router, 'createUrlTree');
  });

  describe('when feature flag is TRUE', () => {
    it('should allow navigation if manualReportVersion is enabled', () => {
      environment.manualReportVersion = true;
      const guard = featureFlagGuard('manualReportVersion');
      const result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));

      expect(result).toBe(true);
      expect(createUrlSpy).not.toHaveBeenCalled();
    });
  });

  describe('when feature flag is FALSE', () => {
    it('should block navigation and redirect to default reports if manualReportVersion is disabled', () => {
      environment.manualReportVersion = false;

      const guard = featureFlagGuard('manualReportVersion');
      TestBed.runInInjectionContext(() => guard(mockRoute, mockState));

      expect(createUrlSpy).toHaveBeenCalledWith(['/reports']);
    });

    it('should block navigation and redirect to overrid location if manualReportVersion is disabled', () => {
      environment.manualReportVersion = false;

      const guard = featureFlagGuard('manualReportVersion', '/login');
      TestBed.runInInjectionContext(() => guard(mockRoute, mockState));

      expect(createUrlSpy).toHaveBeenCalledWith(['/login']);
    });
  });
});
