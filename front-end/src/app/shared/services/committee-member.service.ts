import { computed, inject, Injectable, resource } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectUserLoginData } from 'app/store/user-login-data.selectors';
import { CommitteeStore } from 'app/committee/committee.store';
import { TableListService } from '../interfaces/table-list-service.interface';
import { CommitteeCount, CommitteeMember, CommitteeMemberValidation, ListRestResponse, Roles } from '../models';
import { ApiService, QueryParams } from './api.service';

@Injectable({ providedIn: 'root' })
export class CommitteeMemberService implements TableListService<CommitteeMember> {
  private readonly committeeStore = inject(CommitteeStore);
  private readonly apiService = inject(ApiService);
  private readonly endpoint = '/committee-members/';

  private readonly store = inject(Store);
  private readonly userSignal = this.store.selectSignal(selectUserLoginData);

  readonly _committeeCounts = resource({
    params: () => ({
      committeeId: this.committeeStore.committee()?.committee_id,
    }),
    loader: async ({ params }) => {
      if (!params.committeeId) {
        return { member: 0, admin: 0 };
      }
      const [member, admin] = await Promise.all([this.getMemberCount(), this.getAdminCount()]);
      return {
        member: member.count,
        admin: admin.count,
      };
    },
    defaultValue: { member: 0, admin: 0 },
  });
  readonly committeeCounts = this._committeeCounts.asReadonly();

  public readonly needsSecondAdmin = computed(() => {
    if (Roles[this.userSignal().role as keyof typeof Roles] !== Roles.COMMITTEE_ADMINISTRATOR) {
      return false;
    }
    const committeeCounts = this.committeeCounts.value();
    if (committeeCounts.member < 1) {
      return false;
    }
    return committeeCounts.admin < 2;
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
    this._committeeCounts.reload();
    return CommitteeMember.fromJSON(response);
  }

  public async delete(member: CommitteeMember): Promise<null> {
    await this.apiService.delete<null>(`/committee-members/${member.id}/remove-member/`);
    this._committeeCounts.reload();
    return null;
  }

  async update(member: CommitteeMember): Promise<CommitteeMember> {
    const updated = await this.apiService.put<CommitteeMember>(`${this.endpoint}${member.id}/`, member);
    this._committeeCounts.reload();
    return updated;
  }
}
