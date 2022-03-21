import { HttpClient } from '@angular/common/http';
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

  getHeaders() {
    return {
      'Content-Type': 'application/json',
      Authorization: `JWT ${this.token}`,
    };
  }

  public get<T>(endpoint: string): Observable<T> {
    const headers = this.getHeaders();
    return this.http.get<T>(`${environment.apiUrl}${endpoint}`, { headers: headers });
  }

  public post<T>(endpoint: string, payload: any): Observable<T> {
    const headers = this.getHeaders();
    return this.http.post<T>(`${environment.apiUrl}${endpoint}`, payload, { headers: headers });
  }

  public put<T>(endpoint: string, payload: any): Observable<T> {
    const headers = this.getHeaders();
    return this.http.put<T>(`${environment.apiUrl}${endpoint}`, payload, { headers: headers });
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
      switchMap(() => this.get<T>(endpoint).pipe(tap((_) => this.store.dispatch(spinnerOffAction()))))
    );
  }

  public spinnerPost<T>(endpoint: string, payload: any): Observable<T> {
    return of(null).pipe(
      delay(0),
      tap(() => this.store.dispatch(spinnerOnAction())),
      switchMap(() => this.post<T>(endpoint, payload).pipe(tap((_) => this.store.dispatch(spinnerOffAction()))))
    );
  }

  public spinnerPut<T>(endpoint: string, payload: any): Observable<T> {
    return of(null).pipe(
      delay(0),
      tap(() => this.store.dispatch(spinnerOnAction())),
      switchMap(() => this.put<T>(endpoint, payload).pipe(tap((_) => this.store.dispatch(spinnerOffAction()))))
    );
  }

  public spinnerDelete<T>(endpoint: string): Observable<T> {
    return of(null).pipe(
      delay(0),
      tap(() => this.store.dispatch(spinnerOnAction())),
      switchMap(() => this.delete<T>(endpoint).pipe(tap((_) => this.store.dispatch(spinnerOffAction()))))
    );
  }
}
