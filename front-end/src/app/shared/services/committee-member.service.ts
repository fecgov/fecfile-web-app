import { computed, inject, Injectable, Resource, ResourceStatus } from '@angular/core';
import { TableListService } from '../interfaces/table-list-service.interface';
import { ApiService, QueryParams } from './api.service';
import { CommitteeMember, ListRestResponse, Roles } from '../models';
import { Store } from '@ngrx/store';
import { selectCommitteeAccount } from 'app/store/committee-account.selectors';
import { selectUserLoginData } from 'app/store/user-login-data.selectors';
import { createResource } from '../utils/resource';

@Injectable({
  providedIn: 'root',
})
export class CommitteeMemberService implements TableListService<CommitteeMember> {
  private readonly apiService = inject(ApiService);
  private readonly endpoint = '/committee-members/';

  private readonly store = inject(Store);
  private readonly committee$ = this.store.selectSignal(selectCommitteeAccount);
  private readonly user$ = this.store.selectSignal(selectUserLoginData);

  public membersResource = createResource({
    request: () => ({ committee: this.committee$() }),
    loader: ({ request }) => {
      if (request.committee) {
        console.log('getting members');
        return this.getMembers();
      }
      return Promise.resolve([]);
    },
    defaultValue: [],
  });

  public readonly needsSecondAdmin = computed(() => {
    if (
      Roles[this.user$().role as keyof typeof Roles] !== Roles.COMMITTEE_ADMINISTRATOR ||
      this.membersResource.value().length < 1
    )
      return false;
    return (
      this.membersResource.value().filter((m) => Roles[m.role as keyof typeof Roles] === Roles.COMMITTEE_ADMINISTRATOR)
        .length < 2
    );
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

  public async getMembers(): Promise<CommitteeMember[]> {
    const response = await this.apiService.get<Array<CommitteeMember>>(this.endpoint);
    return response.map((item) => CommitteeMember.fromJSON(item));
  }

  public async addMember(email: string, role: typeof Roles): Promise<CommitteeMember> {
    const response = await this.apiService.post(`${this.endpoint}add-member/`, { email: email, role: role });
    return CommitteeMember.fromJSON(response);
  }

  //prettier-ignore
  public delete(member: CommitteeMember): Promise<null> {
    return this.apiService.delete<null>(`/committee-members/${member.id}/remove-member/`);
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
