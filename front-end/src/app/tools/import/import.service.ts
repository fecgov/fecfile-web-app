import { HttpClient, HttpContext, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiService, getHeaders } from 'app/shared/services/api.service';

export interface ImportDetail {
  id: string;
  status: string;
}

@Injectable({
  providedIn: 'root',
})
export class ImportService {
  private apiService = inject(ApiService);
  private importUrl = '/imports';

  async startParse(importId: string): Promise<ImportDetail> {
    return this.apiService.post(`${this.importUrl}/${importId}/start-parse/`, {});
  }

  async getImport(importId: string): Promise<ImportDetail> {
    return this.apiService.get(`${this.importUrl}/${importId}/`);
  }
}
