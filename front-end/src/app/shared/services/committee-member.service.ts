import { inject, Injectable } from '@angular/core';
import { TableListService } from '../interfaces/table-list-service.interface';
import { ApiService, QueryParams } from './api.service';
import { CommitteeMember, ListRestResponse, Roles } from '../models';

@Injectable({
  providedIn: 'root',
})
export class CommitteeMemberService implements TableListService<CommitteeMember> {
  private readonly apiService = inject(ApiService);
  private readonly endpoint = '/committee-members/';

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
    const members = response.map((item) => CommitteeMember.fromJSON(item));
    return members;
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
}
