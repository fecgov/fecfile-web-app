import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

interface ErrorSampleRates {
  runtime: number;
  promise: number;
  http4xx: number;
  http5xx: number;
}

interface ErrorReportingConfig {
  enabled: boolean;
  endpoint: string;
  sampleRates: ErrorSampleRates;
  dedupeWindowMs: number;
  batchSize: number;
  flushIntervalMs: number;
  maxMessageLength: number;
  maxStackLength: number;
  maxPayloadBytes: number;
}

interface ReportBase {
  type: 'runtime' | 'promise' | 'http';
  level: 'error' | 'warning';
  timestamp: string;
  path: string;
  userAgent: string;
  appEnvironment: string;
}

interface RuntimeReport extends ReportBase {
  type: 'runtime';
  message: string;
  stack?: string;
  source?: string;
}

interface PromiseReport extends ReportBase {
  type: 'promise';
  message: string;
  stack?: string;
}

interface HttpReport extends ReportBase {
  type: 'http';
  method: string;
  url: string;
  status: number;
  statusText: string;
  message: string;
}

type FrontendErrorReport = RuntimeReport | PromiseReport | HttpReport;

interface NormalizedError {
  message: string;
  stack?: string;
}

@Injectable({ providedIn: 'root' })
export class FrontendErrorReportingService {
  private readonly defaultConfig: ErrorReportingConfig = {
    enabled: false,
    endpoint: '/frontend-error-report',
    sampleRates: {
      runtime: 1,
      promise: 1,
      http4xx: 0.1,
      http5xx: 1,
    },
    dedupeWindowMs: 30000,
    batchSize: 10,
    flushIntervalMs: 5000,
    maxMessageLength: 500,
    maxStackLength: 2000,
    maxPayloadBytes: 12000,
  };

  private readonly config: ErrorReportingConfig = {
    ...this.defaultConfig,
    ...environment.errorReporting,
    sampleRates: {
      ...this.defaultConfig.sampleRates,
      ...environment.errorReporting?.sampleRates,
    },
  };

  private readonly queue: FrontendErrorReport[] = [];
  private readonly recentFingerprints = new Map<string, number>();
  private flushTimerId: ReturnType<typeof setTimeout> | null = null;
  private listenersAttached = false;

  initializeGlobalListeners(): void {
    if (!this.config.enabled || this.listenersAttached) {
      return;
    }

    this.listenersAttached = true;

    globalThis.addEventListener('unhandledrejection', (event: PromiseRejectionEvent) => {
      this.reportPromiseRejection(event.reason);
    });

    globalThis.addEventListener('error', (event: ErrorEvent) => {
      if (event.error) {
        this.reportRuntimeError(event.error, 'window.error');
        return;
      }
      this.reportRuntimeError(event.message || 'Unknown script error', 'window.error');
    });

    globalThis.addEventListener('pagehide', () => {
      this.flushQueue();
    });

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.flushQueue();
      }
    });
  }

  reportRuntimeError(error: unknown, source?: string): void {
    if (!this.shouldSample(this.config.sampleRates.runtime)) {
      return;
    }

    const normalized = this.normalizeError(error);
    const report: RuntimeReport = {
      ...this.baseReport('runtime', 'error'),
      message: normalized.message,
      stack: normalized.stack,
      source,
    };
    this.enqueue(report);
  }

  reportPromiseRejection(reason: unknown): void {
    if (!this.shouldSample(this.config.sampleRates.promise)) {
      return;
    }

    const normalized = this.normalizeError(reason);
    const report: PromiseReport = {
      ...this.baseReport('promise', 'error'),
      message: normalized.message,
      stack: normalized.stack,
    };
    this.enqueue(report);
  }

  reportHttpError(input: { method: string; url: string; status: number; statusText: string; message: string }): void {
    const sampleRate =
      input.status >= 500 || input.status === 0 ? this.config.sampleRates.http5xx : this.config.sampleRates.http4xx;
    if (!this.shouldSample(sampleRate)) {
      return;
    }

    const report: HttpReport = {
      ...this.baseReport('http', input.status >= 500 || input.status === 0 ? 'error' : 'warning'),
      method: this.sanitize(input.method),
      url: this.sanitize(input.url),
      status: input.status,
      statusText: this.sanitize(input.statusText),
      message: this.sanitize(input.message),
    };
    this.enqueue(report);
  }

  private baseReport<T extends FrontendErrorReport['type']>(
    type: T,
    level: FrontendErrorReport['level'],
  ): ReportBase & { type: T } {
    return {
      type,
      level,
      timestamp: new Date().toISOString(),
      path: this.sanitize(globalThis.location.pathname + globalThis.location.search),
      userAgent: this.sanitize(navigator.userAgent),
      appEnvironment: this.sanitize(environment.name),
    };
  }

  private normalizeError(error: unknown): NormalizedError {
    if (error instanceof Error) {
      return {
        message: this.sanitize(error.message),
        stack: this.sanitizeStack(error.stack),
      };
    }

    if (typeof error === 'string') {
      return { message: this.sanitize(error) };
    }

    try {
      return { message: this.sanitize(JSON.stringify(error)) };
    } catch {
      return { message: 'Unknown error' };
    }
  }

  private sanitize(value: string): string {
    // strip email addresses, secrets, and cap message length
    const withoutSecrets = value
      .replaceAll(/[A-Za-z0-9._%+-]{1,64}@[A-Za-z0-9-]{1,63}(?:\.[A-Za-z0-9-]{1,63}){1,4}/g, '[redacted-email]')
      .replaceAll(/(token|password|secret|sessionid)=([^&\s]+)/gi, '$1=[redacted]');
    return withoutSecrets.slice(0, this.config.maxMessageLength);
  }

  private sanitizeStack(value: string | undefined): string | undefined {
    // sanitize contents and cap stack length
    if (!value) {
      return undefined;
    }
    return this.sanitize(value).slice(0, this.config.maxStackLength);
  }

  private shouldSample(rate: number): boolean {
    if (!this.config.enabled) {
      return false;
    }
    if (rate >= 1) {
      return true;
    }
    if (rate <= 0) {
      return false;
    }
    return Math.random() < rate;
  }

  private enqueue(report: FrontendErrorReport): void {
    const fingerprint = this.fingerprint(report);
    if (!this.shouldQueue(fingerprint)) {
      return;
    }

    this.queue.push(report);
    if (this.queue.length >= this.config.batchSize) {
      this.flushQueue();
      return;
    }

    this.flushTimerId ??= setTimeout(() => {
      this.flushTimerId = null;
      this.flushQueue();
    }, this.config.flushIntervalMs);
  }

  private shouldQueue(fingerprint: string): boolean {
    const now = Date.now();
    const previous = this.recentFingerprints.get(fingerprint);
    if (previous && now - previous < this.config.dedupeWindowMs) {
      return false;
    }
    this.recentFingerprints.set(fingerprint, now);
    this.cleanupFingerprints(now);
    return true;
  }

  private cleanupFingerprints(now: number): void {
    for (const [key, value] of this.recentFingerprints.entries()) {
      if (now - value > this.config.dedupeWindowMs) {
        this.recentFingerprints.delete(key);
      }
    }
  }

  private fingerprint(report: FrontendErrorReport): string {
    if (report.type === 'http') {
      return `${report.type}:${report.method}:${report.url}:${report.status}:${report.message}`;
    }
    return `${report.type}:${report.message}:${report.stack ?? ''}`;
  }

  private flushQueue(): void {
    if (!this.config.enabled || this.queue.length === 0) {
      return;
    }

    while (this.queue.length > 0) {
      const batch = this.queue.splice(0, this.config.batchSize);
      this.sendBatch(batch);
    }
  }

  private sendBatch(batch: FrontendErrorReport[]): void {
    const body = JSON.stringify({ reports: batch });
    if (body.length > this.config.maxPayloadBytes) {
      if (batch.length > 1) {
        this.sendBatch(batch.slice(0, Math.ceil(batch.length / 2)));
        this.sendBatch(batch.slice(Math.ceil(batch.length / 2)));
      }
      return;
    }

    const beaconPayload = new Blob([body], { type: 'application/json' });
    if (navigator.sendBeacon?.(this.config.endpoint, beaconPayload)) {
      return;
    }

    void fetch(this.config.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      keepalive: true,
      credentials: 'same-origin',
    }).catch(() => undefined);
  }
}
