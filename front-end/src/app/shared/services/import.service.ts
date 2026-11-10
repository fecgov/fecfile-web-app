import { HttpClient, HttpContext, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { getHeaders } from './api.service';

@Injectable({ providedIn: 'root' })
export class ImportService {
  private readonly http = inject(HttpClient);
  private readonly cookieService = inject(CookieService);

  public upload<T>(endpoint: string, file: File): Promise<T> {
    const payload = new FormData();
    payload.append('file', file, file.name);
    // The browser supplies the multipart boundary; retain CSRF and session credentials.
    const headers = new HttpHeaders(getHeaders(this.cookieService)).delete('Content-Type');
    return firstValueFrom(
      this.http.post<T>(`${environment.apiUrl}${endpoint}`, payload, {
        headers,
        withCredentials: true,
      }),
    );
  }

}
