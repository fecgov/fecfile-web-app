import { InjectionToken } from '@angular/core';
import { environment } from 'environments/environment';

export interface FeatureFlags {
  showGlossary: boolean;
  showForm3: boolean;
  showSchedF: boolean;
  enableUnassignedTransactions: boolean;
  enableImport: boolean;
  manualReportVersion: boolean;
  userCanSetFilingFrequency: boolean;
}

export const FEATURE_FLAGS = new InjectionToken<FeatureFlags>('FEATURE_FLAGS', {
  providedIn: 'root',
  factory: () => ({ ...environment.featureFlags }),
});
