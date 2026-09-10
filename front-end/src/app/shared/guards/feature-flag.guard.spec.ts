/* eslint-disable @typescript-eslint/no-explicit-any */
import { TestBed } from '@angular/core/testing';
import { featureFlagGuard } from './feature-flag.guard';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlCreationOptions, UrlTree } from '@angular/router';
import { Mock } from 'vitest';
import { FEATURE_FLAGS, FeatureFlags } from 'environments/config/feature-flag.config';

describe('featureFlagGuard', () => {
  let createUrlSpy: Mock<(commands: readonly any[], navigationExtras?: UrlCreationOptions) => UrlTree>;
  const mockRoute = {} as ActivatedRouteSnapshot;
  const mockState = {} as RouterStateSnapshot;
  const defaultMockFlags: FeatureFlags = {
    showGlossary: false,
    showForm3: false,
    showSchedF: false,
    enableUnassignedTransactions: false,
    enableImport: false,
    manualReportVersion: false,
    userCanSetFilingFrequency: false,
  };

  function setupTest() {
    const router = TestBed.inject(Router);
    createUrlSpy = vi.spyOn(router, 'createUrlTree');
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Router],
    });
  });

  describe('when feature flag is TRUE', () => {
    it('should allow navigation if manualReportVersion is enabled', () => {
      TestBed.overrideProvider(FEATURE_FLAGS, { useValue: { ...defaultMockFlags, manualReportVersion: true } });
      setupTest();
      const guard = featureFlagGuard('manualReportVersion');
      const result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));

      expect(result).toBe(true);
      expect(createUrlSpy).not.toHaveBeenCalled();
    });
  });

  describe('when feature flag is FALSE', () => {
    it('should block navigation and redirect to default reports if manualReportVersion is disabled', () => {
      TestBed.overrideProvider(FEATURE_FLAGS, { useValue: { ...defaultMockFlags, manualReportVersion: false } });
      setupTest();
      const guard = featureFlagGuard('manualReportVersion');
      TestBed.runInInjectionContext(() => guard(mockRoute, mockState));

      expect(createUrlSpy).toHaveBeenCalledWith(['/reports']);
    });

    it('should block navigation and redirect to overrid location if manualReportVersion is disabled', () => {
      TestBed.overrideProvider(FEATURE_FLAGS, { useValue: { ...defaultMockFlags, manualReportVersion: false } });
      setupTest();
      const guard = featureFlagGuard('manualReportVersion', '/login');
      TestBed.runInInjectionContext(() => guard(mockRoute, mockState));

      expect(createUrlSpy).toHaveBeenCalledWith(['/login']);
    });
  });
});
