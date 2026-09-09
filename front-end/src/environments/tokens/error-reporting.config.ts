import { InjectionToken } from '@angular/core';
import { environment } from 'environments/environment';

export interface ErrorReportingConfig {
  enabled: boolean;
  endpoint: string;
  sampleRates: { runtime: number; promise: number; http4xx: number; http5xx: number };
  dedupeWindowMs: number;
  batchSize: number;
  flushIntervalMs: number;
  maxMessageLength: number;
  maxStackLength: number;
  maxPayloadBytes: number;
}

export const ERROR_REPORTING_CONFIG = new InjectionToken<ErrorReportingConfig>('ERROR_REPORTING_CONFIG', {
  providedIn: 'root',
  factory: () => environment.errorReporting,
});
