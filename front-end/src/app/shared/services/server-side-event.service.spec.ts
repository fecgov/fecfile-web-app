/* eslint-disable @typescript-eslint/no-explicit-any */
import { TestBed } from '@angular/core/testing';
import { ServerSideEventService, CalculationStatus } from './server-side-event.service';
import { environment } from 'environments/environment';

class MockEventSource {
  url: string | URL;
  options: EventSourceInit | undefined;
  onmessage: ((this: EventSource, ev: MessageEvent) => any) | null = null;
  onerror: ((this: EventSource, ev: Event) => any) | null = null;
  close: jasmine.Spy = jasmine.createSpy('close');

  static instance: MockEventSource;

  constructor(url: string | URL, options?: EventSourceInit) {
    this.url = url;
    this.options = options;
    MockEventSource.instance = this;
  }

  emitMessage(data: string) {
    if (this.onmessage) {
      this.onmessage.call(this as any, new MessageEvent('message', { data }));
    }
  }

  emitError() {
    if (this.onerror) {
      this.onerror.call(this as any, new Event('error'));
    }
  }

  emitClosedError() {
    if (this.onerror) {
      this.onerror.call(this as any, new Event('error'));
    }
  }
}

describe('ServerSideEventService', () => {
  let service: ServerSideEventService;
  let originalEventSource: any;

  beforeEach(() => {
    originalEventSource = window.EventSource;
    window.EventSource = MockEventSource as any;

    TestBed.configureTestingModule({
      providers: [ServerSideEventService],
    });
    service = TestBed.inject(ServerSideEventService);
  });

  afterEach(() => {
    window.EventSource = originalEventSource;
  });

  describe('calculationNotification', () => {
    const reportId = 'test-report-123';

    it('should create an EventSource with the correct URL and options', () => {
      service.calculationNotification(reportId).subscribe();
      const expectedUrl = `${environment.apiUrl}/sse/${reportId}/calculation-status/`;
      expect(MockEventSource.instance.url).toBe(expectedUrl);
      expect(MockEventSource.instance.options).toEqual({ withCredentials: true });
    });

    it('should emit SUCCEEDED status and complete', (done) => {
      service.calculationNotification(reportId).subscribe({
        next: (status) => {
          expect(status).toBe(CalculationStatus.SUCCEEDED);
        },
        complete: () => {
          done();
        },
      });

      MockEventSource.instance.emitMessage(CalculationStatus.SUCCEEDED);
    });

    it('should ignore statuses other than SUCCEEDED', () => {
      const nextSpy = jasmine.createSpy('next');
      service.calculationNotification(reportId).subscribe(nextSpy);

      MockEventSource.instance.emitMessage(CalculationStatus.CALCULATING);
      MockEventSource.instance.emitMessage('LISTENING');

      expect(nextSpy).not.toHaveBeenCalled();
    });

    it('should propagate errors from onerror', (done) => {
      service.calculationNotification(reportId).subscribe({
        error: (err) => {
          expect(err).toBeInstanceOf(Event);
          done();
        },
      });

      MockEventSource.instance.emitError();
    });

    it('should close the EventSource on unsubscription', () => {
      const subscription = service.calculationNotification(reportId).subscribe();
      subscription.unsubscribe();
      expect(MockEventSource.instance.close).toHaveBeenCalled();
    });
  });

  describe('webPrintNotification', () => {
    const submissionId = 'test-submission-456';

    it('should create an EventSource with the correct URL', () => {
      service.webPrintNotification(submissionId).subscribe();
      const expectedUrl = `${environment.apiUrl}/sse/${submissionId}/webprint-status/`;
      expect(MockEventSource.instance.url).toBe(expectedUrl);
    });

    it('should emit a final status and then complete', (done) => {
      const finalStatus = 'COMPLETED';
      service.webPrintNotification(submissionId).subscribe({
        next: (status) => {
          expect(status).toBe(finalStatus);
        },
        complete: () => {
          done();
        },
      });

      MockEventSource.instance.emitMessage(finalStatus);
    });

    it('should not complete on LISTENING or keep-alive messages', () => {
      const completeSpy = jasmine.createSpy('complete');
      service.webPrintNotification(submissionId).subscribe({ complete: completeSpy });

      MockEventSource.instance.emitMessage('LISTENING');
      MockEventSource.instance.emitMessage(': keep-alive');

      expect(completeSpy).not.toHaveBeenCalled();
    });

    it('should propagate real errors from onerror', (done) => {
      service.webPrintNotification(submissionId).subscribe({
        error: (err) => {
          expect(err).toBeInstanceOf(Event);
          done();
        },
      });

      MockEventSource.instance.emitError();
    });

    it('should close the EventSource on unsubscription', () => {
      const subscription = service.webPrintNotification(submissionId).subscribe();
      subscription.unsubscribe();
      expect(MockEventSource.instance.close).toHaveBeenCalled();
    });
  });
});
