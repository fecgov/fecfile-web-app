import { inject, Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { HttpResponse } from '@angular/common/module.d-CnjH8Dlt';
import { Roles } from '../models';

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

  public async resetSubmittingReport(report_id: string): Promise<any> {
    return this.apiService.post<HttpResponse<any>>(`${this.apiEndpoint}/reset-submitting-report/`, {
      report_id: report_id,
    });
  }

  public async addUserToCommittee(email: string, committee_id: string, role: keyof Roles): Promise<any> {
    return this.apiService.post<HttpResponse<any>>(`${this.apiEndpoint}/add-user-to-committee/`, {
      user_email: email,
      committee_id: committee_id,
      role: role,
    });
  }

  public async failOpenSubmissions(warning_acknowledged: boolean): Promise<any> {
    return this.apiService.post<HttpResponse<any>>(`${this.apiEndpoint}/fail-open-submissions/`, {
      admin_knows_what_admin_wants: warning_acknowledged,
    });
  }
}
