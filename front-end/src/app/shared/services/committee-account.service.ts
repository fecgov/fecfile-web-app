import { HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { firstValueFrom, map, Observable } from 'rxjs';
import { CommitteeAccount } from '../models/committee-account.model';
import { ListRestResponse } from '../models/rest-api.model';
import { ApiService } from './api.service';
import { FecApiService } from './fec-api.service';

@Injectable({
  providedIn: 'root',
})
export class CommitteeAccountService {
  constructor(
    private fecApiService: FecApiService,
    private store: Store,
    private apiService: ApiService,
  ) { }

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

  public registerCommitteeAccount(committeeId: string): Promise<CommitteeAccount> {
    return firstValueFrom(
      this.apiService.post<CommitteeAccount>('/committees/register/',
        { committee_id: committeeId }, {}, [HttpStatusCode.BadRequest])
        .pipe(
          map((response) => {
            if (!response.body) {
              throw new Error();
            }
            return response.body;
          }),
        )
    );
  }
}
