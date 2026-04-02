import type { Mock } from 'vitest';
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
    let cookieSetterSpy: Mock;

    beforeEach(() => {
      // Setup spies for document.cookie
      let cookieStore = '';

      cookieSetterSpy = vi.spyOn(document, 'cookie', 'set').mockImplementation((cookie) => {
        cookieStore = cookie;
      });

      vi.spyOn(document, 'cookie', 'get').mockImplementation(() => {
        return cookieStore;
      });
    });

    it('should return true when cookies are enabled', () => {
      const result = service.areCookiesEnabled();
      expect(cookieSetterSpy).toHaveBeenCalledWith('cookietest=1');
      expect(result).toBe(true);
    });

    it('should return false when cookies are not enabled', () => {
      // In this case, simulate cookies being disabled by not updating the cookieStore.
      cookieSetterSpy.mockImplementation(() => {
        throw new Error('Cookies are disabled');
      });

      const result = service.areCookiesEnabled();
      expect(result).toBe(false);
    });

    it('should handle exceptions gracefully and return false', () => {
      // Simulate an error while setting a cookie
      cookieSetterSpy.mockImplementation(() => {
        throw new Error('Simulated error');
      });

      const result = service.areCookiesEnabled();
      expect(result).toBe(false);
    });
  });
});
