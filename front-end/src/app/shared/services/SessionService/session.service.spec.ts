import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CookieService } from 'ngx-cookie-service';

import { SessionService } from './session.service';

describe('SessionService', () => {
  let service: SessionService;
  let cookieService: CookieService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CookieService],
    });
    service = TestBed.inject(SessionService);
    cookieService = TestBed.inject(CookieService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#getSession should return user cookie', () => {
    const cookieValue = 'abc';
    spyOn(cookieService, 'get').and.callFake(() => cookieValue);
    const session = service.getSession();
    expect(session).toBe(cookieValue);
  });

  it('#getSession should return 0 if no cookie value', () => {
    spyOn(cookieService, 'get').and.callFake(() => '');
    const session = service.getSession();
    expect(session).toBe(0);
  });

  it('#destroy should clear access token', () => {
    service.accessToken = 'abc';
    service.destroy();
    expect(service.accessToken).toBe('');
  });
});
