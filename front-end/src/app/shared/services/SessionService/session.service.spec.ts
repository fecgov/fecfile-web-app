import { TestBed, inject } from '@angular/core/testing';
import { CookieService } from 'ngx-cookie-service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SessionService } from './session.service';

xdescribe('SessionService', () => {
  let cookieService: CookieService;
  let sessionService: SessionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SessionService, CookieService],
    });
  });

  beforeEach(() => {
    cookieService = TestBed.get(CookieService);

    sessionService = TestBed.get(SessionService);
  });

  xit('should be created', () => {
    expect(sessionService).toBeTruthy();
  });

  xit('should get session cookie', () => {
    cookieService.set('user', 'test');

    expect(sessionService.getSession()).toBe('test');
  });

  xit('should destroy session cookie', () => {
    cookieService.delete('user');

    expect(sessionService.getSession()).toBe(0);
  });
});
