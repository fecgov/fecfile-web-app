import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
<<<<<<< HEAD
import { firstValueFrom, map, Observable } from 'rxjs';
=======
import { map, Observable } from 'rxjs';
import { Candidate } from '../models/candidate.model';
>>>>>>> develop
import { CommitteeAccount } from '../models/committee-account.model';
import { FecApiPaginatedResponse } from '../models/fec-api.model';
import { FecFiling } from '../models/fec-filing.model';
import { ApiService } from './api.service';

export type QueryParamsType = { [param: string]: string | number | boolean | readonly (string | number | boolean)[] };

@Injectable({
  providedIn: 'root',
})
export class FecApiService {
  constructor(
    private http: HttpClient,
    private apiService: ApiService,
  ) {}

  getHeaders() {
    return {
      'Content-Type': 'application/json',
    };
  }

  /**
   * Gets the commitee account details.
   *
   * @return     {Observable}  The commitee details.
   */
  public getCommitteeDetails(committeeId: string | null, checkCanCreate = false): Observable<CommitteeAccount> {
    if (!committeeId) {
      throw new Error('Fecfile: No Committee Id provided in getCommitteeDetails()');
    }

    return this.apiService
      .get<FecApiPaginatedResponse>(
        `/openfec/${committeeId.toUpperCase()}/committee?check_can_create=${checkCanCreate}`,
      )
      .pipe(
        map((response) => {
          const ca = response.results[0] as CommitteeAccount;
          if (ca && !ca.filing_frequency) ca.filing_frequency = 'Q';
          return ca;
        }),
      );
  }

  /**
   * Gets the most recent F1 filing
   *
   * Fist checks the realtime enpdpoint for a recent F1 filing.  If none is found, a request is
   * made to a different endpoint that is updated nightly.  The realtime endpoint will have
   * more recent filings, but does not provide filings older than 6 months.
   * The nightly endpoint keeps a longer history
   *
   * @return     {Observable<FecFiling | undefined>}  Most recent F1 filing.
   */
  public getCommitteeRecentF1Filing(committeeId: string | undefined): Observable<FecFiling | undefined> {
    if (!committeeId) {
      throw new Error('Fecfile: No Committee Id provided in getCommitteeRecentF1Filing()');
    }

    return this.apiService
      .get<FecFiling>(`/openfec/${committeeId}/f1_filing/`)
      .pipe(map((response) => FecFiling.fromJSON(response)));
  }
}
