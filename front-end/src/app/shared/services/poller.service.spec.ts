import { TestBed } from '@angular/core/testing';
import { PollerService } from './poller.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('PollerService', () => {
  let service: PollerService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    // Mock <script> tag on the page
    const script = document.createElement('script');
    script.src = 'https://myapp.com/assets/main.abc123.js';
    document.head.appendChild(script);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PollerService],
    });

    service = TestBed.inject(PollerService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    // Cleanup mock script tags after each test
    const scripts = document.getElementsByTagName('script');
    for (const script of Array.from(scripts)) {
      if (script.src.includes('main.abc123.js')) {
        script.remove();
      }
    }
  });

  it('should initialize currentMainScript from <script> tag', () => {
    expect((service as any).currentMainScript()).toBe('main.abc123.js');
  });

  it('should detect new version when remote script is different', () => {
    (service as any).remoteMainScript.set('main.xyz999.js');
    expect(service.isNewVersionAvailable()).toBeTrue();
  });

  it('should not detect new version if remote script is same', () => {
    (service as any).remoteMainScript.set('main.abc123.js');
    expect(service.isNewVersionAvailable()).toBeFalse();
  });

  it('should set deploymentUrl and fetch remote main script when startPolling is called', (done) => {
    service.startPolling('/version.html');

    // Simulate the interval callback manually since we can't fast-forward setInterval in Jasmine
    (service as any).fetchRemoteMainScript('/version.html').then(() => {
      const req = httpMock.expectOne('/version.html');
      expect(req.request.method).toBe('GET');

      const mockHtml = `<html><head><script src="main.def456.js" type="module"></script></head></html>`;
      req.flush(mockHtml);

      // Give the fetchRemoteMainScript time to update the signal
      setTimeout(() => {
        expect((service as any).remoteMainScript()).toBe('main.def456.js');
        done();
      }, 0);
    });
  });

  it('should clear deploymentUrl when stopPolling is called', () => {
    service.startPolling('/version.html');
    service.stopPolling();
    expect((service as any).deploymentUrl()).toBeNull();
  });

  it('should set remoteMainScript to null on fetch error', (done) => {
    service.startPolling('/bad-url');

    (service as any).fetchRemoteMainScript('/bad-url').then(() => {
      const req = httpMock.expectOne('/bad-url');
      req.error(new ErrorEvent('Network error'));

      setTimeout(() => {
        expect((service as any).remoteMainScript()).toBeNull();
        done();
      }, 0);
    });
  });
});
