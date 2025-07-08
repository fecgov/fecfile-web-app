import { TestBed } from '@angular/core/testing';
import { CookieCheckService } from './cookie-check.service';

describe('CookieCheckService', () => {
  let service: CookieCheckService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CookieCheckService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('areCookiesEnabled', () => {
    let cookieSetterSpy: jasmine.Spy;

    beforeEach(() => {
      // Setup spies for document.cookie
      let cookieStore = '';

      cookieSetterSpy = spyOnProperty(document, 'cookie', 'set').and.callFake((cookie) => {
        cookieStore = cookie;
      });

      spyOnProperty(document, 'cookie', 'get').and.callFake(() => {
        return cookieStore;
      });
    });

    it('should return true when cookies are enabled', () => {
      const result = service.areCookiesEnabled();
      expect(cookieSetterSpy).toHaveBeenCalledWith('cookietest=1');
      expect(result).toBeTrue();
    });

    it('should return false when cookies are not enabled', () => {
      // In this case, simulate cookies being disabled by not updating the cookieStore.
      cookieSetterSpy.and.callFake(() => {
        throw new Error('Cookies are disabled');
      });

      const result = service.areCookiesEnabled();
      expect(result).toBeFalse();
    });

    it('should handle exceptions gracefully and return false', () => {
      // Simulate an error while setting a cookie
      cookieSetterSpy.and.throwError('Simulated error');

      const result = service.areCookiesEnabled();
      expect(result).toBeFalse();
    });
  });
});
