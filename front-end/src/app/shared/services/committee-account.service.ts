import { Injectable } from '@angular/core';
import { map, mergeMap, Observable, of } from 'rxjs';
import { CommitteeAccount } from '../models/committee-account.model';
import { FecApiService } from './fec-api.service';
import { Store } from '@ngrx/store';
import { ApiService } from './api.service';
import { ListRestResponse } from '../models/rest-api.model';
import { TableListService } from '../interfaces/table-list-service.interface';
import { CommitteeMember } from '../models/committee-member.model';

@Injectable({
  providedIn: 'root',
})
export class CommitteeAccountService {
  constructor(private fecApiService: FecApiService, private store: Store, private apiService: ApiService) {}

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
  constructor(private apiService: ApiService, private committeeAccountService: CommitteeAccountService) {}

  public getTableData(pageNumber = 1, ordering = ''): Observable<ListRestResponse> {
    let parameter_string = `?page=${pageNumber}`;
    if (ordering?.length > 0) {
      parameter_string += `&ordering=${ordering}`;
    }
    return this.committeeAccountService.getCommittees().pipe(
      mergeMap((committees) =>
        this.apiService.get<ListRestResponse>(`/committees/${committees[0].id}/members/${parameter_string}`)
      ),
      map((response: ListRestResponse) => {
        response.results = response.results.map((item) => CommitteeMember.fromJSON(item));
        return response;
      })
    );
  }

  public delete(_: CommitteeMember): Observable<null> {
    // eslint-disable-line @typescript-eslint/no-unused-vars
    return of(null);
  }
}
