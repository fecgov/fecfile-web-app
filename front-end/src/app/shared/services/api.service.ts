import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap, delay, switchMap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Store } from '@ngrx/store';
import { selectUserLoginData } from 'app/store/login.selectors';
import { UserLoginData } from '../models/user.model';
import { spinnerOnAction, spinnerOffAction } from 'app/store/spinner.actions';

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
    console.log(endpoint);
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

  // prettier-ignore
  public spinnerPost<T>(endpoint: string, payload: any, queryParams: any = {}): Observable<T> { // eslint-disable-line @typescript-eslint/no-explicit-any
    return of(null).pipe(
      delay(0),
      tap(() => this.store.dispatch(spinnerOnAction())),
      switchMap(() => this.post<T>(endpoint, payload, queryParams).pipe(tap(() => this.store.dispatch(spinnerOffAction()))))
    );
  }

  // prettier-ignore
  public spinnerPut<T>(endpoint: string, payload: any, queryParams: any = {}): Observable<T> { // eslint-disable-line @typescript-eslint/no-explicit-any
    return of(null).pipe(
      delay(0),
      tap(() => this.store.dispatch(spinnerOnAction())),
      switchMap(() => this.put<T>(endpoint, payload, queryParams).pipe(tap(() => this.store.dispatch(spinnerOffAction()))))
    );
  }

  public spinnerDelete<T>(endpoint: string): Observable<T> {
    return of(null).pipe(
      delay(0),
      tap(() => this.store.dispatch(spinnerOnAction())),
      switchMap(() => this.delete<T>(endpoint).pipe(tap(() => this.store.dispatch(spinnerOffAction()))))
    );
  }
}
