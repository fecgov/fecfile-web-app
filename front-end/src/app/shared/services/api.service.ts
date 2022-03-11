import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { SessionService } from './SessionService/session.service';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient, private sessionService: SessionService) {}

  getHeaders() {
    const token: string = this.sessionService.getToken();
    return {
      'Content-Type': 'application/json',
      Authorization: `JWT ${token}`,
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
    // Code to activate spinner here.

    return this.get<T>(endpoint).pipe(tap((x) => console.log('Code to deactivate spinner here')));
  }

  public spinnerPost<T>(endpoint: string, payload: any): Observable<T> {
    // Code to activate spinner here.

    return this.post<T>(endpoint, payload).pipe(tap((x) => console.log('Code to deactivate spinner here')));
  }

  public spinnerPut<T>(endpoint: string, payload: any): Observable<T> {
    // Code to activate spinner here.

    return this.put<T>(endpoint, payload).pipe(tap((x) => console.log('Code to deactivate spinner here')));
  }

  public spinnerDelete<T>(endpoint: string): Observable<T> {
    // Code to activate spinner here.

    return this.delete<T>(endpoint).pipe(tap((x) => console.log('Code to deactivate spinner here')));
  }
}
