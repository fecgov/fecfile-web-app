import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { CommitteeAccount } from '../models/committee-account.model';

@Injectable({
  providedIn: 'root',
})
export class CommitteeAccountsService {
  constructor(private apiService: ApiService) {}

  /**
   * Gets the commitee account details.
   *
   * @return     {Observable}  The commitee details.
   */
  public getDetails(): Observable<CommitteeAccount> {
    return this.apiService.get<CommitteeAccount>('/core/get_committee_details');
  }
}
