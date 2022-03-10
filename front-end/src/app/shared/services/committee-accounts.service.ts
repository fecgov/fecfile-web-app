import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

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
  public getDetails(): Observable<any> {
    return this.apiService.get<any>('/core/get_committee_details');
  }
}
