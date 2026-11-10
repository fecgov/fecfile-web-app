import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { firstValueFrom, Observable, timer, exhaustMap, takeWhile } from 'rxjs';
import { environment } from '../../../environments/environment';
import { getHeaders } from './api.service';

export interface ContactImportJob {
  id: number;
  import_status: string;
  total_rows: number;
  totals: { new?: number; invalid?: number; error?: number };
  errors: { row: number | null; fields: Record<string, string[]> }[];
  preview: Record<string, string | null>[];
}

export const ACTIVE_IMPORT_STATES = new Set(['CREATED', 'PARSING', 'CONFIRMED', 'IMPORTING']);

@Injectable({ providedIn: 'root' })
export class ImportService {
  private readonly http = inject(HttpClient);
  private readonly cookieService = inject(CookieService);
  private readonly jobsUrl = `${environment.apiUrl}/contacts/imports`;

  upload(file: File): Promise<ContactImportJob> {
    const payload = new FormData();
    payload.append('file', file, file.name);
    const headers = new HttpHeaders(getHeaders(this.cookieService)).delete('Content-Type');
    return firstValueFrom(
      this.http.post<ContactImportJob>(`${environment.apiUrl}${environment.importUploadEndpoint}`, payload, {
        headers,
        withCredentials: true,
      }),
    );
  }

  confirm(id: number): Promise<ContactImportJob> {
    return firstValueFrom(
      this.http.post<ContactImportJob>(
        `${this.jobsUrl}/${id}/confirm/`,
        {},
        {
          headers: getHeaders(this.cookieService),
          withCredentials: true,
        },
      ),
    );
  }

  watch(id: number): Observable<ContactImportJob> {
    return timer(0, 1000).pipe(
      exhaustMap(() =>
        this.http.get<ContactImportJob>(`${this.jobsUrl}/${id}/`, {
          headers: getHeaders(this.cookieService),
          withCredentials: true,
        }),
      ),
      takeWhile((job) => ACTIVE_IMPORT_STATES.has(job.import_status), true),
    );
  }
}
