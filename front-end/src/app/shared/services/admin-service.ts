import { inject, Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { HttpResponse } from '@angular/common/module.d-CnjH8Dlt';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private readonly apiService = inject(ApiService);
  readonly apiEndpoint = '/admin';

  public async enableUser(email: string): Promise<any> {
    return this.apiService.post<HttpResponse<any>>(`${this.apiEndpoint}/enable-user/`, { user_email: email });
  }

  public async disableUser(email: string): Promise<any> {
    return this.apiService.post<HttpResponse<any>>(`${this.apiEndpoint}/disable-user/`, { user_email: email });
  }
}
