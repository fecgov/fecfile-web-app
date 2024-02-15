import { HttpClient, HttpContext, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ALLOW_ERROR_CODES } from '../interceptors/http-error.interceptor';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
  ) {}

  getHeaders(headersToAdd: object = {}) {
    const csrfToken = `${this.cookieService.get('csrftoken')}`;
    const baseHeaders = {
      'Content-Type': 'application/json',
      ...(csrfToken && { 'x-csrftoken': `${csrfToken}` }),
    };
    return { ...baseHeaders, ...headersToAdd };
  }

  getQueryParams(
    queryParams: { [param: string]: string | number | boolean | readonly (string | number | boolean)[] } = {},
  ) {
    return new HttpParams({ fromObject: queryParams });
  }

  public get<T>(
    endpoint: string,
    params?: { [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean> },
  ): Observable<T>;
  public get<T>(
    endpoint: string,
    params?: { [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean> },
    allowedErrorCodes?: number[],
  ): Observable<HttpResponse<T>>;
  public get<T>(
    endpoint: string,
    params: { [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean> } = {},
    allowedErrorCodes?: number[],
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

  // prettier-ignore
  public post<T>(endpoint: string, payload: any, queryParams: any = {}): Observable<T> { // eslint-disable-line @typescript-eslint/no-explicit-any
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
    return this.http.post<T>(`${endpoint}`, payload, { headers: headers, params: params, withCredentials: true });
  }

  // prettier-ignore
  public put<T>(endpoint: string, payload: any, queryParams: any = {}): Observable<T> { // eslint-disable-line @typescript-eslint/no-explicit-any
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
    return this.http.delete<T>(`${environment.apiUrl}${endpoint}`, { headers: headers, withCredentials: true });
  }
}
