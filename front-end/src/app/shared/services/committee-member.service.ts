import { computed, inject, Injectable, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectUserLoginData } from 'app/store/user-login-data.selectors';
import { TableListService } from '../interfaces/table-list-service.interface';
import { CommitteeCount, CommitteeMember, CommitteeMemberValidation, ListRestResponse, Roles } from '../models';
import { ApiService, QueryParams } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class CommitteeMemberService implements TableListService<CommitteeMember> {
  private readonly apiService = inject(ApiService);
  private readonly endpoint = '/committee-members/';

  private readonly store = inject(Store);
  private readonly userSignal = this.store.selectSignal(selectUserLoginData);
  private readonly committeeCounts = signal({
    member: 0,
    admin: 0,
  });
  public readonly needsSecondAdmin = computed(() => {
    if (Roles[this.userSignal().role as keyof typeof Roles] !== Roles.COMMITTEE_ADMINISTRATOR) {
      return false;
    }
    if (this.committeeCounts().member < 1) {
      return false;
    }
    return this.committeeCounts().admin < 2;
  });

  public async getTableData(pageNumber = 1, ordering = '', params: QueryParams = {}): Promise<ListRestResponse> {
    let parameter_string = `?page=${pageNumber}`;
    if (ordering?.length > 0) {
      parameter_string += `&ordering=${ordering}`;
    }
    const response = await this.apiService.get<ListRestResponse>(`${this.endpoint}${parameter_string}`, params);
    response.results = response.results.map((item) => CommitteeMember.fromJSON(item));
    return response;
  }

  public async updateCommitteeCounts(): Promise<void> {
    const memberCount = (await this.getMemberCount()).count;
    const adminCount = (await this.getAdminCount()).count;
    this.committeeCounts.set({
      member: memberCount,
      admin: adminCount,
    });
  }

  public async emailValidationCheck(email: string): Promise<CommitteeMemberValidation> {
    return await this.apiService.get<CommitteeMemberValidation>(`${this.endpoint}validation_check/?email=${email}`);
  }

  public async getMemberCount(): Promise<CommitteeCount> {
    return await this.apiService.get<CommitteeCount>(`${this.endpoint}member_count/`);
  }

  public async getAdminCount(): Promise<CommitteeCount> {
    return await this.apiService.get<CommitteeCount>(`${this.endpoint}admin_count/`);
  }

  public async addMember(email: string, role: typeof Roles): Promise<CommitteeMember> {
    const response = await this.apiService.post(`${this.endpoint}add-member/`, { email: email, role: role });
    await this.updateCommitteeCounts();
    return CommitteeMember.fromJSON(response);
  }

  //prettier-ignore
  public async delete(member: CommitteeMember): Promise<null> {
    await this.apiService.delete<null>(`/committee-members/${member.id}/remove-member/`);
    await this.updateCommitteeCounts();
    return null;
  }

  async update(member: CommitteeMember): Promise<CommitteeMember> {
    const updated = await this.apiService.put<CommitteeMember>(`${this.endpoint}${member.id}/`, member);
    await this.updateCommitteeCounts();
    return updated;
  }
}
