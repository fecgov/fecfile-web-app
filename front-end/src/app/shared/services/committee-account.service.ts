import { Injectable } from '@angular/core';
import { concatMap, Observable } from 'rxjs';
import { CommitteeAccount } from '../models/committee-account.model';
import { FecApiService } from './fec-api.service';
import { Store } from '@ngrx/store';
import { selectUserLoginData } from 'app/store/login.selectors';

@Injectable({
  providedIn: 'root',
})
export class CommitteeAccountService {
  constructor(private fecApiService: FecApiService, private store: Store) {}

  /**
   * Gets the commitee account details.
   *
   * @return     {Observable}  The commitee details.
   */
  public getDetails(): Observable<CommitteeAccount> {
      const userLoginData$ = this.store.select(selectUserLoginData);
      return userLoginData$.pipe(
        concatMap(userLoginData => {
          return this.fecApiService.getDetails(userLoginData.committee_id);
        })
      );
  }
}
