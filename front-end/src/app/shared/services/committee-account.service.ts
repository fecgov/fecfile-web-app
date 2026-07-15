import { HttpStatusCode } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CommitteeAccount } from '../models/committee-account.model';
import { ListRestResponse } from '../models/rest-api.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class CommitteeAccountService {
  private readonly apiService = inject(ApiService);

  public async getCommittees(): Promise<CommitteeAccount[]> {
    const response = await this.apiService.get<ListRestResponse>(`/committees/`);
    return response.results as CommitteeAccount[];
  }

  public getAvailableCommittee(committeeId: string): Promise<CommitteeAccount> {
    return this.apiService.get(`/committees/get-available-committee/?committee_id=${committeeId}`);
  }

  public activateCommittee(committeeUUID?: string): Promise<boolean> {
    return this.apiService.post(`/committees/${committeeUUID}/activate/`, {});
  }

  public getActiveCommittee(): Promise<CommitteeAccount> {
    return this.apiService.get(`/committees/active/`);
  }

  public async createCommitteeAccount(committeeId: string): Promise<CommitteeAccount> {
    const response = await this.apiService.post<CommitteeAccount>(
      '/committees/create_account/',
      { committee_id: committeeId },
      {},
      [HttpStatusCode.BadRequest],
    );
    if (!response.body) {
      throw new Error();
    }
    return response.body;
  }
}
