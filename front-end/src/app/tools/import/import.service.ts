import { HttpClient, HttpContext, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiService, getHeaders } from 'app/shared/services/api.service';

@Injectable({
  providedIn: 'root',
})
export class ImportService {
  private readonly http: HttpClient = inject(HttpClient);
  private readonly cookieService: CookieService = inject(CookieService);

  public upload<T>(file: File): Promise<T> {
    const payload = new FormData();
    payload.append('file', file, file.name);

    // The browser supplies the multipart boundary; retain CSRF and session credentials.
    const headers = new HttpHeaders(getHeaders(this.cookieService)).delete('Content-Type');
    return firstValueFrom(
      this.http.post<T>(`${environment.apiUrl}/imports/upload-file/`, payload, {
        headers,
        withCredentials: true,
      }),
    );
  }
}
