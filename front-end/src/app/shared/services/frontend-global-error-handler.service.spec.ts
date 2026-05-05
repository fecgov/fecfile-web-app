import { TestBed } from '@angular/core/testing';
import { MessageService } from 'primeng/api';
import { FrontendGlobalErrorHandlerService } from './frontend-global-error-handler.service';
import { FrontendErrorReportingService } from './frontend-error-reporting.service';

describe('FrontendGlobalErrorHandlerService', () => {
  let handler: FrontendGlobalErrorHandlerService;
  const reportRuntimeError = vi.fn();
  const addToast = vi.fn();
  const originalLocation = globalThis.location;
  const originalSessionStorage = globalThis.sessionStorage;
  const reloadSpy = vi.fn();
  const sessionStorageState = new Map<string, string>();
  const sessionStorageMock = {
    getItem(key: string): string | null {
      return sessionStorageState.get(key) ?? null;
    },
    setItem(key: string, value: string): void {
      sessionStorageState.set(key, value);
    },
    removeItem(key: string): void {
      sessionStorageState.delete(key);
    },
    clear(): void {
      sessionStorageState.clear();
    },
    key(index: number): string | null {
      return Array.from(sessionStorageState.keys())[index] ?? null;
    },
    get length(): number {
      return sessionStorageState.size;
    },
  } as Storage;

  beforeEach(() => {
    vi.useFakeTimers();
    reportRuntimeError.mockReset();
    addToast.mockReset();
    reloadSpy.mockReset();
    sessionStorageMock.clear();

    Object.defineProperty(globalThis, 'sessionStorage', {
      configurable: true,
      value: sessionStorageMock,
    });

    Object.defineProperty(globalThis, 'location', {
      configurable: true,
      value: {
        href: 'https://example.test/reports/f3x?report=123',
        reload: reloadSpy,
      },
    });

    TestBed.configureTestingModule({
      providers: [
        FrontendGlobalErrorHandlerService,
        {
          provide: FrontendErrorReportingService,
          useValue: {
            reportRuntimeError,
          },
        },
        {
          provide: MessageService,
          useValue: {
            add: addToast,
          },
        },
      ],
    });

    handler = TestBed.inject(FrontendGlobalErrorHandlerService);
  });

  afterEach(() => {
    Object.defineProperty(globalThis, 'location', {
      configurable: true,
      value: originalLocation,
    });
    Object.defineProperty(globalThis, 'sessionStorage', {
      configurable: true,
      value: originalSessionStorage,
    });
    vi.useRealTimers();
  });

  it('should be created', () => {
    expect(handler).toBeTruthy();
  });

  it('should forward error to reporting service', () => {
    const error = new Error('global error test');
    handler.handleError(error);

    expect(reportRuntimeError).toHaveBeenCalledWith(error, 'angular.error-handler');
  });

  it('should reload app on stale chunk module script mime error', () => {
    const error = new Error(
      'Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "text/html". Strict MIME type checking is enforced for module scripts per HTML spec.',
    );

    handler.handleError(error);

    expect(addToast).toHaveBeenCalledTimes(1);
    expect(reloadSpy).toHaveBeenCalledTimes(0);

    vi.advanceTimersByTime(5000);

    expect(reloadSpy).toHaveBeenCalledTimes(1);
  });

  it('should only attempt one reload in marker TTL window', () => {
    const error = new Error('ChunkLoadError: Loading chunk 42 failed.');

    handler.handleError(error);
    handler.handleError(error);

    expect(addToast).toHaveBeenCalledTimes(1);

    vi.runAllTimers();

    expect(reloadSpy).toHaveBeenCalledTimes(1);
  });
});
