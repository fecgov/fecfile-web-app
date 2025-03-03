import { discardPeriodicTasks, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { PollerService } from './poller.service';
import { provideHttpClient } from '@angular/common/http';

describe('PollerService', () => {
  let service: PollerService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), PollerService],
    });
    service = TestBed.inject(PollerService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start polling and call compareVersions', fakeAsync(() => {
    const compareVersionsSpy = spyOn(service, 'compareVersions').and.callFake(() => Promise.resolve());

    service.startPolling('test-url');

    // Fast-forward time to simulate the interval
    tick(5000);

    expect(compareVersionsSpy).toHaveBeenCalled();

    // Discard the periodic task (interval)
    discardPeriodicTasks();
  }));

  it('should stop polling when stopPolling is called', () => {
    service.startPolling('test-url');
    service.stopPolling();

    // Assuming versionCheckSubscription is set to public for testing purposes
    expect(service.versionCheckSubscription?.closed).toBe(true);
  });

  it('should detect new version available', fakeAsync(() => {
    const mockHtmlResponse = `
      <html>
        <head>
          <script src="main.abc123.js" type="module"></script>
        </head>
      </html>`;

    spyOn(document, 'getElementsByTagName').and.returnValue([
      {
        src: 'http://localhost/main.abc122.js',
      },
    ] as unknown as HTMLCollectionOf<Element>);

    service.compareVersions('test-url');

    const req = httpMock.expectOne('test-url');
    req.flush(mockHtmlResponse, { status: 200, statusText: 'OK' });

    tick(); // Fast-forward any pending asynchronous tasks

    service.isNewVersionAvailable$.subscribe((isAvailable) => {
      expect(isAvailable).toBeTrue();
    });
  }));

  it('should handle error in version check', async () => {
    service.compareVersions('test-url');

    const req = httpMock.expectOne('test-url');
    req.error(new ErrorEvent('Network error'), { status: 500 });

    service.isNewVersionAvailable$.subscribe((isAvailable) => {
      expect(isAvailable).toBeFalse();
    });
  });
});
