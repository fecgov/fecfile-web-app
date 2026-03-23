/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient, HttpErrorResponse, HttpHandler, HttpRequest, HttpStatusCode } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { firstValueFrom, throwError } from 'rxjs';
import { testMockStore } from '../utils/unit-test.utils';

import { HttpErrorInterceptor } from './http-error.interceptor';
import { LoginService } from '../services/login.service';

describe('HttpErrorInterceptor', () => {
  let store: Store;
  let loginService: LoginService;

  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [HttpErrorInterceptor, HttpClient, HttpHandler, LoginService, provideMockStore(testMockStore())],
    }),
  );

  beforeEach(() => {
    store = TestBed.inject(Store);
    loginService = TestBed.inject(LoginService);
  });

  it('should be created', () => {
    const interceptor: HttpErrorInterceptor = TestBed.inject(HttpErrorInterceptor);
    expect(interceptor).toBeTruthy();
  });

  it('should handle 403 incoming error', () => {
    const testIterceptor: HttpErrorInterceptor = TestBed.inject(HttpErrorInterceptor);
    const httpRequest = new HttpRequest('GET', '/test-url');
    const httpHandlerSpy = {
      handle: vi.fn().mockReturnValue(throwError(() => new HttpErrorResponse({ status: HttpStatusCode.Forbidden }))),
    } as any;
    const logOutSpy = vi.spyOn(loginService, 'logOut');

    httpHandlerSpy.handle.mockReturnValue(
      throwError(() => new HttpErrorResponse({ status: HttpStatusCode.Forbidden })),
    );

    testIterceptor.intercept(httpRequest, httpHandlerSpy).subscribe({
      next: (x) => x,
      error: (y) => y,
    });
    expect(logOutSpy).toHaveBeenCalled();
  });

  it('should handle outgoing error', async () => {
    const testIterceptor: HttpErrorInterceptor = TestBed.inject(HttpErrorInterceptor);
    const httpRequest = new HttpRequest('GET', '/test-url');

    const httpHandlerSpy = {
      handle: vi.fn().mockName('HttpHandler.handle'),
    };
    vi.spyOn(console, 'log');
    httpHandlerSpy.handle.mockReturnValue(
      throwError(
        () =>
          new HttpErrorResponse({
            status: HttpStatusCode.BadRequest,
            error: new ErrorEvent(''),
          }),
      ),
    );

    vi.spyOn(store, 'dispatch');

    let retval = '';
    try {
      await firstValueFrom(testIterceptor.intercept(httpRequest, httpHandlerSpy));
    } catch (error: any) {
      retval = error;
    }
    expect(retval).toEqual('Outgoing HTTP Error: ');
  });

  it('should handle no API response (status === 0)', async () => {
    const testIterceptor: HttpErrorInterceptor = TestBed.inject(HttpErrorInterceptor);
    const httpRequest = new HttpRequest('GET', '/test-url');
    const httpHandlerSpy = {
      handle: vi.fn().mockName('HttpHandler.handle'),
    };
    vi.spyOn(console, 'log');
    httpHandlerSpy.handle.mockReturnValue(
      throwError(
        () =>
          new HttpErrorResponse({
            status: 0,
          }),
      ),
    );

    vi.spyOn(store, 'dispatch');

    let retval = '';
    try {
      await firstValueFrom(testIterceptor.intercept(httpRequest, httpHandlerSpy));
    } catch (error: any) {
      retval = error;
    }
    expect(retval).toEqual('Failed to receive an HTTP response from the server: 0 Unknown Error');
  });
});
