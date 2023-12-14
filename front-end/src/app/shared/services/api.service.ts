import { HttpClient, HttpContext, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { iif, Observable, of } from 'rxjs';
import { delay, switchMap, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Store } from '@ngrx/store';
import { selectUserLoginData } from 'app/store/login.selectors';
import { UserLoginData } from '../models/user.model';
import { spinnerOffAction, spinnerOnAction } from 'app/store/spinner.actions';
import { CookieService } from 'ngx-cookie-service';
import { ALLOW_ERROR_CODES } from '../interceptors/http-error.interceptor';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private loggedInCommitteeId: string | undefined;

  constructor(private http: HttpClient, private store: Store, private cookieService: CookieService) {
    this.store.select(selectUserLoginData).subscribe((userLoginData: UserLoginData) => {
      this.loggedInCommitteeId = userLoginData.committee_id;
    });
  }

  getHeaders(headersToAdd: object = {}) {
    const csrfToken = `${this.cookieService.get('csrftoken')}`;
    const baseHeaders = {
      'Content-Type': 'application/json',
      ...(csrfToken && {'x-csrftoken': `${csrfToken}`}),
    };
    return {...baseHeaders, ...headersToAdd};
  }

  getQueryParams(
    queryParams: { [param: string]: string | number | boolean | readonly (string | number | boolean)[] } = {}
  ) {
    return new HttpParams({fromObject: queryParams});
  }

  public get<T>(
    endpoint: string,
    params?: { [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean> }
  ): Observable<T>;
  public get<T>(
    endpoint: string,
    params?: { [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean> },
    allowedErrorCodes?: number[]
  ): Observable<HttpResponse<T>>;
  public get<T>(
    endpoint: string,
    params: { [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean> } = {},
    allowedErrorCodes?: number[]
  ): Observable<T> | Observable<HttpResponse<T>> {
    const headers = this.getHeaders();
    if (allowedErrorCodes) {
      return this.http.get<T>(`${environment.apiUrl}${endpoint}`, {
        headers: headers,
        params: params,
        withCredentials: true,
        observe: 'response',
        responseType: 'json',
        context: new HttpContext().set(ALLOW_ERROR_CODES, allowedErrorCodes),
      });
    }
    return this.http.get<T>(`${environment.apiUrl}${endpoint}`, {
      headers: headers,
      params: params,
      withCredentials: true,
    });
  }

  private _post<T>(endpoint: string, payload: any, queryParams: any = {}): Observable<T> { // eslint-disable-line @typescript-eslint/no-explicit-any
    const headers = this.getHeaders();
    const params = this.getQueryParams(queryParams);
    return this.http.post<T>(`${environment.apiUrl}${endpoint}`, payload, {
      headers: headers,
      params: params,
      withCredentials: true
    });
  }

  // prettier-ignore
  public postAbsoluteUrl<T>(endpoint: string, payload: any, queryParams: any = {}): Observable<T> { // eslint-disable-line @typescript-eslint/no-explicit-any
    const headers = this.getHeaders();
    const params = this.getQueryParams(queryParams);
    return this.http.post<T>(`${endpoint}`, payload, {headers: headers, params: params, withCredentials: true});
  }

  private _put<T>(endpoint: string, payload: any, queryParams: any = {}): Observable<T> { // eslint-disable-line @typescript-eslint/no-explicit-any
    const headers = this.getHeaders();
    const params = this.getQueryParams(queryParams);
    return this.http.put<T>(`${environment.apiUrl}${endpoint}`, payload, {
      headers: headers,
      params: params,
      withCredentials: true
    });
  }

  public delete<T>(endpoint: string): Observable<T> {
    const headers = this.getHeaders();
    return this.http.delete<T>(`${environment.apiUrl}${endpoint}`, {headers: headers, withCredentials: true});
  }

  public isAuthenticated() {
    return !!this.loggedInCommitteeId || this.cookieService.check(environment.ffapiCommitteeIdCookieName);
  }

  public spinnerGet<T>(endpoint: string): Observable<T> {
    // For spinnerGet, spinnerPost, spinnerPut, and spinnerDelete methods there is an
    // issue with the *ngIf that hides/shows the spinner in the layout.component.html
    // template that triggers the "Expression has changed after it was checked" error.
    // The debug(0) in the return statement allows the view generation process
    // to finish before the dispatch is made of the spinnerOnAction which updates
    // the flag in the view template to turn the spinner on.
    // Read about the issue here: https://blog.angular-university.io/angular-debugging/
    return of(null).pipe(
      delay(0),
      tap(() => this.store.dispatch(spinnerOnAction())),
      switchMap(() => this.get<T>(endpoint).pipe(tap(() => this.store.dispatch(spinnerOffAction()))))
    );
  }

  public post<T>(endpoint: string, payload: any, queryParams: any = {}, spinner = false): Observable<T> { // eslint-disable-line @typescript-eslint/no-explicit-any
    const post$ = this._post<T>(endpoint, payload, queryParams);
    return iif(() => spinner,
      of(null).pipe(
        delay(0),
        tap(() => this.store.dispatch(spinnerOnAction())),
        switchMap(() => post$.pipe(
          tap(() => this.store.dispatch(spinnerOffAction())))
        )
      ), post$);
  }

  public put<T>(endpoint: string, payload: any, queryParams: any = {}, spinner = false): Observable<T> { // eslint-disable-line @typescript-eslint/no-explicit-any
    const put$ = this._put<T>(endpoint, payload, queryParams);
    return iif(() => spinner,
      of(null).pipe(
        delay(0),
        tap(() => this.store.dispatch(spinnerOnAction())),
        switchMap(() => put$.pipe(
          tap(() => this.store.dispatch(spinnerOffAction())))
        )
      ), put$);
  }

  public spinnerDelete<T>(endpoint: string): Observable<T> {
    return of(null).pipe(
      delay(0),
      tap(() => this.store.dispatch(spinnerOnAction())),
      switchMap(() => this.delete<T>(endpoint).pipe(tap(() => this.store.dispatch(spinnerOffAction()))))
    );
  }
}
