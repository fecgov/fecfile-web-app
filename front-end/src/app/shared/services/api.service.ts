import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectUserLoginData } from 'app/store/login.selectors';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private jwt = "";
  private csrfToken = "";

  constructor(private http: HttpClient, private store: Store, 
    private cookieService: CookieService) {
    const userLoginData$ = this.store.select(selectUserLoginData);
    userLoginData$.subscribe(userLoginData => {
      this.jwt = (userLoginData && userLoginData.token) || "";
    });
    this.csrfToken = `${this.cookieService.get("csrftoken")}`;
  }

  getHeaders(headersToAdd: object = {}) {
    const baseHeaders = {
      'Content-Type': 'application/json',
      ...(this.jwt && {Authorization: `JWT ${this.jwt}`}),
      ...(this.csrfToken && {'X-CSRFToken':`${this.csrfToken}` })
    };
    return { ...baseHeaders, ...headersToAdd };
  }

  getQueryParams(
    queryParams: { [param: string]: string | number | boolean | readonly (string | number | boolean)[] } = {}
  ) {
    return new HttpParams({ fromObject: queryParams });
  }

  public get<T>(endpoint: string): Observable<T> {
    const headers = this.getHeaders();
    return this.http.get<T>(`${environment.apiUrl}${endpoint}`, { headers: headers, withCredentials: true });
  }

  // prettier-ignore
  public post<T>(endpoint: string, payload: any, queryParams: any = {}): Observable<T> { // eslint-disable-line @typescript-eslint/no-explicit-any
    const headers = this.getHeaders();
    const params = this.getQueryParams(queryParams);
    return this.http.post<T>(`${environment.apiUrl}${endpoint}`, payload, { headers: headers , params: params, withCredentials: true});
  }

  // prettier-ignore
  public postAbsoluteUrl<T>(endpoint: string, payload: any, queryParams: any = {}): Observable<T> { // eslint-disable-line @typescript-eslint/no-explicit-any
    const headers = this.getHeaders();
    const params = this.getQueryParams(queryParams);
    return this.http.post<T>(`${endpoint}`, payload, { headers: headers , params: params, withCredentials: true});
  }

  // prettier-ignore
  public put<T>(endpoint: string, payload: any, queryParams: any = {}): Observable<T> { // eslint-disable-line @typescript-eslint/no-explicit-any
    const headers = this.getHeaders();
    const params = this.getQueryParams(queryParams);
    return this.http.put<T>(`${environment.apiUrl}${endpoint}`, payload, { headers: headers , params: params, withCredentials: true});
  }

  public delete<T>(endpoint: string): Observable<T> {
    const headers = this.getHeaders();
    return this.http.delete<T>(`${environment.apiUrl}${endpoint}`, { headers: headers, withCredentials: true });
  }

  public clearTokens() {
    this.jwt = "";
    this.csrfToken = "";
  }
}
