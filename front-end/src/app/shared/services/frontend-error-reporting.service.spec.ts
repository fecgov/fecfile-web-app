import { TestBed } from '@angular/core/testing';
import { FrontendErrorReportingService } from './frontend-error-reporting.service';

describe('FrontendErrorReportingService', () => {
  let service: FrontendErrorReportingService;

  const sampleRuntimeReport = {
    type: 'runtime' as const,
    level: 'error' as const,
    timestamp: new Date().toISOString(),
    path: '/test',
    userAgent: 'test-agent',
    appEnvironment: 'test',
    message: 'runtime message',
    stack: 'stack',
    source: 'spec',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FrontendErrorReportingService);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should not throw when runtime error is reported', () => {
    expect(() => service.reportRuntimeError(new Error('runtime test'))).not.toThrow();
  });

  it('should not throw when promise rejection is reported', () => {
    expect(() => service.reportPromiseRejection('promise test')).not.toThrow();
  });

  it('redacts email addresses and token-like secrets', () => {
    const internalService = service as unknown as {
      sanitize: (value: string) => string;
    };

    const sanitized = internalService.sanitize(
      'contact admin@example.com?token=abc123&sessionid=xyz789 password=hunter2',
    );

    expect(sanitized).toContain('[redacted-email]');
    expect(sanitized).toContain('token=[redacted]');
    expect(sanitized).toContain('sessionid=[redacted]');
    expect(sanitized).toContain('password=[redacted]');
    expect(sanitized).not.toContain('admin@example.com');
    expect(sanitized).not.toContain('abc123');
    expect(sanitized).not.toContain('xyz789');
    expect(sanitized).not.toContain('hunter2');
  });

  it('registers listeners once and dispatches to handlers', () => {
    const reportPromiseSpy = vi.spyOn(service, 'reportPromiseRejection');
    const reportRuntimeSpy = vi.spyOn(service, 'reportRuntimeError');
    const flushQueueSpy = vi.spyOn(service as unknown as { flushQueue: () => void }, 'flushQueue');

    service.initializeGlobalListeners();

    // Calling initialize twice should not attach duplicate listeners.
    service.initializeGlobalListeners();

    window.dispatchEvent(
      new CustomEvent('unhandledrejection', {
        detail: { reason: 'rejection reason' },
      }),
    );

    window.dispatchEvent(new ErrorEvent('error', { error: new Error('runtime error') }));
    window.dispatchEvent(new Event('pagehide'));

    const visibilitySpy = vi.spyOn(document, 'visibilityState', 'get').mockReturnValue('hidden');
    document.dispatchEvent(new Event('visibilitychange'));

    expect(reportPromiseSpy).toHaveBeenCalled();
    expect(reportRuntimeSpy).toHaveBeenCalled();
    expect(flushQueueSpy).toHaveBeenCalled();
    expect(visibilitySpy).toHaveBeenCalled();
  });

  it('does not attach listeners when reporting is disabled', () => {
    const addWindowListenerSpy = vi.spyOn(window, 'addEventListener');
    const addDocumentListenerSpy = vi.spyOn(document, 'addEventListener');

    const internalService = service as unknown as {
      config: { enabled: boolean };
      initializeGlobalListeners: () => void;
    };
    internalService.config.enabled = false;

    internalService.initializeGlobalListeners();

    expect(addWindowListenerSpy).not.toHaveBeenCalled();
    expect(addDocumentListenerSpy).not.toHaveBeenCalled();
  });

  it('deduplicates repeated fingerprints and cleans stale fingerprints', () => {
    const internalService = service as unknown as {
      config: { dedupeWindowMs: number };
      recentFingerprints: Map<string, number>;
      shouldQueue: (fingerprint: string) => boolean;
    };

    const now = 50000;
    vi.spyOn(Date, 'now').mockReturnValue(now);

    internalService.recentFingerprints.set('stale', now - internalService.config.dedupeWindowMs - 1);

    expect(internalService.shouldQueue('new-fingerprint')).toBe(true);
    expect(internalService.recentFingerprints.has('stale')).toBe(false);
    expect(internalService.shouldQueue('new-fingerprint')).toBe(false);
  });

  it('schedules a flush timer when a report is enqueued', () => {
    vi.useFakeTimers();

    const flushQueueSpy = vi.spyOn(service as unknown as { flushQueue: () => void }, 'flushQueue');
    const internalService = service as unknown as {
      enqueue: (report: typeof sampleRuntimeReport) => void;
    };

    internalService.enqueue(sampleRuntimeReport);
    vi.advanceTimersByTime(5000);

    expect(flushQueueSpy).toHaveBeenCalled();
  });

  it('uses sendBeacon when available and successful', () => {
    const sendBeaconMock = vi.fn().mockReturnValue(true);
    const fetchMock = vi.fn();

    Object.defineProperty(navigator, 'sendBeacon', {
      configurable: true,
      value: sendBeaconMock,
    });
    vi.stubGlobal('fetch', fetchMock);

    const internalService = service as unknown as {
      sendBatch: (batch: Array<typeof sampleRuntimeReport>) => void;
    };

    internalService.sendBatch([sampleRuntimeReport]);

    expect(sendBeaconMock).toHaveBeenCalled();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('falls back to fetch and swallows fetch errors when beacon fails', async () => {
    const sendBeaconMock = vi.fn().mockReturnValue(false);
    const fetchMock = vi.fn().mockRejectedValue(new Error('network fail'));

    Object.defineProperty(navigator, 'sendBeacon', {
      configurable: true,
      value: sendBeaconMock,
    });
    vi.stubGlobal('fetch', fetchMock);

    const internalService = service as unknown as {
      sendBatch: (batch: Array<typeof sampleRuntimeReport>) => void;
    };

    expect(() => internalService.sendBatch([sampleRuntimeReport])).not.toThrow();
    await Promise.resolve();

    expect(sendBeaconMock).toHaveBeenCalled();
    expect(fetchMock).toHaveBeenCalled();
  });
});
