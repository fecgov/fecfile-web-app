import { Injectable } from '@angular/core';
import { firstValueFrom, map, mergeMap, Observable, of } from 'rxjs';
import { CommitteeAccount } from '../models/committee-account.model';
import { FecApiService } from './fec-api.service';
import { Store } from '@ngrx/store';
import { ApiService } from './api.service';
import { ListRestResponse } from '../models/rest-api.model';
import { TableListService } from '../interfaces/table-list-service.interface';
import { CommitteeMember, CommitteeMemberRoles } from '../models/committee-member.model';

@Injectable({
  providedIn: 'root',
})
export class CommitteeAccountService {
  constructor(
    private fecApiService: FecApiService,
    private store: Store,
    private apiService: ApiService,
  ) {}

  public getCommittees(): Observable<CommitteeAccount[]> {
    return this.apiService
      .get<ListRestResponse>(`/committees/`)
      .pipe(map((response) => response.results as CommitteeAccount[]));
  }

  public activateCommittee(committeeUUID?: string): Observable<boolean> {
    return this.apiService.post(`/committees/${committeeUUID}/activate/`, {});
  }

  public getActiveCommittee(): Observable<CommitteeAccount> {
    return this.apiService.get(`/committees/active/`);
  }
}

@Injectable({
  providedIn: 'root',
})
export class CommitteeMemberService implements TableListService<CommitteeMember> {
  constructor(private apiService: ApiService) {}

  public getTableData(pageNumber = 1, ordering = ''): Observable<ListRestResponse> {
    let parameter_string = `?page=${pageNumber}`;
    if (ordering?.length > 0) {
      parameter_string += `&ordering=${ordering}`;
    }
    return this.apiService.get<ListRestResponse>(`/committee-members/?page=${pageNumber}&ordering=${ordering}`).pipe(
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
  public delete(_: CommitteeMember): Observable<null> {// eslint-disable-line @typescript-eslint/no-unused-vars
    return of(null);
  }
}
