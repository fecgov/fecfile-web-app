import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Store } from '@ngrx/store';
import { selectUserLoginData } from 'app/store/login.selectors';
import { UserLoginData } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private token: string | null = null;

  constructor(private http: HttpClient, private store: Store) {
    this.store.select(selectUserLoginData).subscribe((userLoginData: UserLoginData) => {
      this.token = userLoginData.token;
    });
  }

  getHeaders(headersToAdd: object = {}) {
    const baseHeaders = {
      'Content-Type': 'application/json',
      Authorization: `JWT ${this.token}`,
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
    return this.http.get<T>(`${environment.apiUrl}${endpoint}`, { headers: headers });
  }

  // prettier-ignore
  public post<T>(endpoint: string, payload: any, queryParams: any = {}): Observable<T> { // eslint-disable-line @typescript-eslint/no-explicit-any
    const headers = this.getHeaders();
    const params = this.getQueryParams(queryParams);
    return this.http.post<T>(`${environment.apiUrl}${endpoint}`, payload, { headers: headers , params: params});
  }

  // prettier-ignore
  public put<T>(endpoint: string, payload: any, queryParams: any = {}): Observable<T> { // eslint-disable-line @typescript-eslint/no-explicit-any
    const headers = this.getHeaders();
    const params = this.getQueryParams(queryParams);
    return this.http.put<T>(`${environment.apiUrl}${endpoint}`, payload, { headers: headers , params: params});
  }

  public delete<T>(endpoint: string): Observable<T> {
    const headers = this.getHeaders();
    return this.http.delete<T>(`${environment.apiUrl}${endpoint}`, { headers: headers });
  }
}
