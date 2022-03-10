import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from './AuthService/auth.service';
import { SessionService } from './SessionService/session.service';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient, private authService: AuthService, private sessionService: SessionService) {}

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
}
