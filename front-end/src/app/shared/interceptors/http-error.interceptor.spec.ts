import { HttpContext, HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { userLoggedOutAction } from 'app/store/login.actions';
import { throwError } from 'rxjs';
import { testMockStore } from '../utils/unit-test.utils';

import { HttpErrorInterceptor } from './http-error.interceptor';

describe('HttpErrorInterceptor', () => {
  let store: Store;

  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [HttpErrorInterceptor, provideMockStore(testMockStore)],
    }),
  );

  beforeEach(() => {
    store = TestBed.inject(Store);
  });

  it('should be created', () => {
    const interceptor: HttpErrorInterceptor = TestBed.inject(HttpErrorInterceptor);
    expect(interceptor).toBeTruthy();
  });

  it('should handle 403 incoming error', () => {
    const testIterceptor: HttpErrorInterceptor = TestBed.inject(HttpErrorInterceptor);
    const httpRequestSpy = jasmine.createSpyObj('HttpRequest', ['doesNotMatter'], { context: new HttpContext() });
    const httpHandlerSpy = jasmine.createSpyObj('HttpHandler', ['handle']);
    httpHandlerSpy.handle.and.returnValue(
      throwError(() => new HttpErrorResponse({ status: HttpStatusCode.Forbidden })),
    );

    spyOn(store, 'dispatch');

    testIterceptor.intercept(httpRequestSpy, httpHandlerSpy).subscribe(
      (x) => x,
      (y) => y,
    );
    expect(store.dispatch).toHaveBeenCalledWith(userLoggedOutAction());
  });

  it('should handle outgoing error', () => {
    const testIterceptor: HttpErrorInterceptor = TestBed.inject(HttpErrorInterceptor);
    const httpRequestSpy = jasmine.createSpyObj('HttpRequest', ['doesNotMatter'], { context: new HttpContext() });
    const httpHandlerSpy = jasmine.createSpyObj('HttpHandler', ['handle']);
    spyOn(window, 'alert');
    httpHandlerSpy.handle.and.returnValue(
      throwError(
        () =>
          new HttpErrorResponse({
            status: HttpStatusCode.BadRequest,
            error: new ErrorEvent(''),
          }),
      ),
    );

    spyOn(store, 'dispatch');

    testIterceptor.intercept(httpRequestSpy, httpHandlerSpy).subscribe(
      (x) => x,
      (y) => y,
    );
    expect(window.alert).toHaveBeenCalledWith('Outgoing HTTP Error: ');
  });
});
