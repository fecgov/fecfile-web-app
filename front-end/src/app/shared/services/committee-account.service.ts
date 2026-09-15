import { HttpStatusCode } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CommitteeAccount } from '../models/committee-account.model';
import { ListRestResponse } from '../models/rest-api.model';
import { ApiService } from './api.service';
import { CommitteeMemberService } from './committee-member.service';

@Injectable({
  providedIn: 'root',
})
export class CommitteeAccountService {
  private readonly apiService = inject(ApiService);
  public readonly committeeMemberService = inject(CommitteeMemberService);

  public async getCommittees(): Promise<CommitteeAccount[]> {
    const response = await this.apiService.get<ListRestResponse>(`/committees/`);
    return response.results as CommitteeAccount[];
  }

  public getAvailableCommittee(committeeId: string): Promise<CommitteeAccount> {
    return this.apiService.get(`/committees/get-available-committee/?committee_id=${committeeId}`);
  }

  public async activateCommittee(committeeUUID?: string): Promise<CommitteeAccount> {
    const activated = await this.apiService.post<CommitteeAccount>(`/committees/${committeeUUID}/activate/`, {});
    await this.committeeMemberService.updateCommitteeCounts();
    return activated;
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
