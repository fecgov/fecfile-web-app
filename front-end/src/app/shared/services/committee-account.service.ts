import { Injectable } from '@angular/core';
import { map, mergeMap, Observable } from 'rxjs';
import { CommitteeAccount } from '../models/committee-account.model';
import { FecApiService } from './fec-api.service';
import { Store } from '@ngrx/store';
import { selectUserLoginData } from 'app/store/login.selectors';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class CommitteeAccountService {
  constructor(private fecApiService: FecApiService, private store: Store, private apiService: ApiService) {}

  /**
   * Gets the commitee account details.
   *
   * @return     {Observable}  The commitee details.
   */
  public getDetails(): Observable<CommitteeAccount> {
    // for now just get the first committee
    return this.getCommittees().pipe(
      mergeMap((response) => this.fecApiService.getCommitteeDetails(response[0].committee_id as string))
    );
  }

  public getCommittees(): Observable<CommitteeAccount[]> {
    return this.apiService.get<any>(`/committees/`).pipe(map((response) => response.results as CommitteeAccount[]));
  }
}
