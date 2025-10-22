import { computed, effect, inject, Injectable, Resource, ResourceStatus, signal } from '@angular/core';
import { TableListService } from '../interfaces/table-list-service.interface';
import { ApiService, QueryParams } from './api.service';
import { CommitteeMember, ListRestResponse, Roles } from '../models';
import { Store } from '@ngrx/store';
import { selectUserLoginData } from 'app/store/user-login-data.selectors';
import { selectCommitteeAccount } from 'app/store/committee-account.selectors';

@Injectable({
  providedIn: 'root',
})
export class CommitteeMemberService implements TableListService<CommitteeMember> {
  private readonly apiService = inject(ApiService);
  private readonly endpoint = '/committee-members/';

  private readonly store = inject(Store);
  private readonly userSignal = this.store.selectSignal(selectUserLoginData);
  private readonly committeeSignal = this.store.selectSignal(selectCommitteeAccount);

  public readonly membersSignal = signal<CommitteeMember[]>([]);
  public readonly adminsSignal = computed(() => this.membersSignal().filter((m) => m.isAdmin));
  public readonly needsSecondAdmin = computed(() => {
    if (
      Roles[this.userSignal().role as keyof typeof Roles] !== Roles.COMMITTEE_ADMINISTRATOR ||
      this.membersSignal().length < 1
    )
      return false;
    return (
      this.membersSignal().filter((m) => Roles[m.role as keyof typeof Roles] === Roles.COMMITTEE_ADMINISTRATOR).length <
      2
    );
  });

  constructor() {
    effect(() => {
      if (this.committeeSignal().committee_id) {
        this.getMembers();
      } else {
        this.membersSignal.set([]);
      }
    });
  }

  public async getTableData(pageNumber = 1, ordering = '', params: QueryParams = {}): Promise<ListRestResponse> {
    let parameter_string = `?page=${pageNumber}`;
    if (ordering?.length > 0) {
      parameter_string += `&ordering=${ordering}`;
    }
    const response = await this.apiService.get<ListRestResponse>(`${this.endpoint}${parameter_string}`, params);
    response.results = response.results.map((item) => CommitteeMember.fromJSON(item));
    return response;
  }

  public async getMembers(): Promise<CommitteeMember[]> {
    const response = await this.apiService.get<CommitteeMember[]>(this.endpoint);
    const members = response.map((item) => CommitteeMember.fromJSON(item));
    this.membersSignal.set(members);
    return members;
  }

  public async addMember(email: string, role: typeof Roles): Promise<CommitteeMember> {
    const response = await this.apiService.post(`${this.endpoint}add-member/`, { email: email, role: role });
    const member = CommitteeMember.fromJSON(response);
    this.membersSignal.update((members) => [...members, member]);
    return member;
  }

  //prettier-ignore
  public async delete(member: CommitteeMember): Promise<null> {
    await this.apiService.delete<null>(`/committee-members/${member.id}/remove-member/`);
    this.membersSignal.update((members) => members.filter(m => m.email !== member.email));
    return null;
  }

  update(member: CommitteeMember): Promise<CommitteeMember> {
    return this.apiService.put(`${this.endpoint}${member.id}/`, member);
  }

  async waitForResource<T>(resource: Resource<T>): Promise<void> {
    resource.reload();
    while (resource.status() === ResourceStatus.Reloading) {
      await new Promise((resolve) => setTimeout(resolve, 10));
    }
  }
}
