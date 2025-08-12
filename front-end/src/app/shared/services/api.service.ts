import { HttpClient, HttpContext, HttpParams, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ALLOW_ERROR_CODES } from '../interceptors/http-error.interceptor';

export interface QueryParams {
  [param: string]:
    | string
    | number
    | boolean
    | ReadonlyArray<string | number | boolean>
    | readonly (string | number | boolean)[];
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly cookieService = inject(CookieService);

  getHeaders(headersToAdd: object = {}) {
    const csrfToken = `${this.cookieService.get('csrftoken')}`;
    const baseHeaders = {
      //'Content-Type': 'application/json',
      // If using different cache headers,
      // modify CORS_ALLOW_HEADERS in API settings
      'cache-control': 'no-cache, no-store',
      ...(csrfToken && { 'x-csrftoken': `${csrfToken}` }),
    };
    return { ...baseHeaders, ...headersToAdd };
  }

  getQueryParams(queryParams: QueryParams = {}) {
    return new HttpParams({ fromObject: queryParams });
  }

  public get<T>(endpoint: string, params?: QueryParams): Promise<T>;
  public get<T>(endpoint: string, params?: QueryParams, allowedErrorCodes?: number[]): Promise<T>;
  public get<T>(
    endpoint: string,
    params: QueryParams = {},
    allowedErrorCodes?: number[],
  ): Promise<T> | Promise<HttpResponse<T>> {
    const headers = this.getHeaders();
    if (allowedErrorCodes) {
      return firstValueFrom(
        this.http.get<T>(`${environment.apiUrl}${endpoint}`, {
          headers,
          params,
          withCredentials: true,
          observe: 'response',
          responseType: 'json',
          context: new HttpContext().set(ALLOW_ERROR_CODES, allowedErrorCodes),
        }),
      );
    }
    return firstValueFrom(
      this.http.get<T>(`${environment.apiUrl}${endpoint}`, {
        headers,
        params,
        withCredentials: true,
      }),
    );
  }

  public getString(endpoint: string): Promise<string> {
    const headers = this.getHeaders();
    return firstValueFrom(
      this.http.get(`${environment.apiUrl}${endpoint}`, {
        headers: headers,
        withCredentials: true,
        responseType: 'text',
      }),
    );
  }

  public post<T>(endpoint: string, payload: unknown, queryParams?: QueryParams): Promise<T>;
  public post<T>(
    endpoint: string,
    payload: unknown,
    queryParams?: QueryParams,
    allowedErrorCodes?: number[],
    addHeaders?: object,
  ): Promise<HttpResponse<T>>;
  public post<T>(
    endpoint: string,
    payload: unknown,
    queryParams: QueryParams = {},
    allowedErrorCodes?: number[],
    addHeaders: object = {},
  ): Promise<T> | Promise<HttpResponse<T>> {
    const headers = this.getHeaders(addHeaders);
    const params = this.getQueryParams(queryParams);
    if (allowedErrorCodes) {
      return firstValueFrom(
        this.http.post<T>(`${environment.apiUrl}${endpoint}`, payload, {
          headers,
          params,
          withCredentials: true,
          observe: 'response',
          context: new HttpContext().set(ALLOW_ERROR_CODES, allowedErrorCodes),
        }),
      );
    }
    return firstValueFrom(
      this.http.post<T>(`${environment.apiUrl}${endpoint}`, payload, {
        headers,
        params,
        withCredentials: true,
      }),
    );
  }

  public put<T>(endpoint: string, payload: unknown, queryParams?: QueryParams): Promise<T>;
  public put<T>(
    endpoint: string,
    payload: unknown,
    queryParams?: QueryParams,
    allowedErrorCodes?: number[],
  ): Promise<HttpResponse<T>>;
  public put<T>(
    endpoint: string,
    payload: unknown,
    queryParams: QueryParams = {},
    allowedErrorCodes?: number[],
  ): Promise<T> | Promise<HttpResponse<T>> {
    const headers = this.getHeaders();
    const params = this.getQueryParams(queryParams);
    if (allowedErrorCodes) {
      return firstValueFrom(
        this.http.put<T>(`${environment.apiUrl}${endpoint}`, payload, {
          headers,
          params,
          withCredentials: true,
          observe: 'response',
          context: new HttpContext().set(ALLOW_ERROR_CODES, allowedErrorCodes),
        }),
      );
    }
    return firstValueFrom(
      this.http.put<T>(`${environment.apiUrl}${endpoint}`, payload, {
        headers,
        params,
        withCredentials: true,
      }),
    );
  }

  public delete<T>(endpoint: string): Promise<T> {
    const headers = this.getHeaders();
    return firstValueFrom(this.http.delete<T>(`${environment.apiUrl}${endpoint}`, { headers, withCredentials: true }));
  }
}
