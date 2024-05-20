import { Injectable } from '@angular/core';
import { CommitteeMember, CommitteeMemberRoles } from '../models/committee-member.model';
import { TableListService } from '../interfaces/table-list-service.interface';
import { ApiService } from './api.service';
import { ListRestResponse } from '../models/rest-api.model';
import { firstValueFrom, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommitteeMemberService implements TableListService<CommitteeMember> {
  constructor(private apiService: ApiService) {}

  public getTableData(
    pageNumber = 1,
    ordering = '',
    params: { [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean> } = {},
  ): Observable<ListRestResponse> {
    let parameter_string = `?page=${pageNumber}`;
    if (ordering?.length > 0) {
      parameter_string += `&ordering=${ordering}`;
    }
    return this.apiService.get<ListRestResponse>(`/committee-members/${parameter_string}`, params).pipe(
      map((response: ListRestResponse) => {
        response.results = response.results.map((item) => CommitteeMember.fromJSON(item));
        return response;
      }),
    );
  }

  public async getMembers(): Promise<CommitteeMember[]> {
    const response = await firstValueFrom(this.apiService.get<Array<CommitteeMember>>('/committee-members/'));
    const members = response.map((item) => CommitteeMember.fromJSON(item));
    return members;
  }

  public addMember(email: string, role: typeof CommitteeMemberRoles): Observable<CommitteeMember> {
    return this.apiService.post('/committee-members/add-member/', { email: email, role: role }).pipe(
      map((response) => {
        return CommitteeMember.fromJSON(response);
      }),
    );
  }

  //prettier-ignore
  public delete(member: CommitteeMember): Observable<null> {
    return this.apiService.delete<null>(`/committee-members/${member.id}/remove-member/`);
  }
}
