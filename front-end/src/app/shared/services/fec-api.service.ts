import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CommitteeAccount } from '../models/committee-account.model';
import { FecApiPaginatedResponse } from '../models/fec-api.model';
import { Candidate } from '../models/candidate.model';
import { FecFiling } from '../models/fec-filing.model';
import { ApiService } from './api.service';

export type QueryParamsType = { [param: string]: string | number | boolean | readonly (string | number | boolean)[] };

@Injectable({
  providedIn: 'root',
})
export class FecApiService {
  private apiKey: string | null = environment.fecApiKey;

  constructor(private http: HttpClient, private apiService: ApiService) {}

  getHeaders() {
    return {
      'Content-Type': 'application/json',
    };
  }

  getQueryParams(queryParams: QueryParamsType = {}) {
    const allParams: QueryParamsType = { ...{ api_key: this.apiKey || '' }, ...queryParams };
    return new HttpParams({ fromObject: allParams });
  }

  /**
   * Gets the candidate details.
   *
   * @return     {Observable}  The candidate details.
   */
  public getCandidateDetails(candidateId: string | null): Observable<Candidate> {
    if (!candidateId) {
      throw new Error('Fecfile: No Candidate Id provided in getCandidateDetails()');
    }
    const headers = this.getHeaders();
    const params = this.getQueryParams();
    return this.http
      .get<FecApiPaginatedResponse>(`${environment.fecApiUrl}candidate/${candidateId}/`, {
        headers: headers,
        params: params,
      })
      .pipe(map((response: FecApiPaginatedResponse) => (response.results[0] as Candidate) || undefined));
  }

  /**
   * Gets the commitee account details.
   *
   * @return     {Observable}  The commitee details.
   */
  public getCommitteeDetails(committeeId: string | null): Observable<CommitteeAccount> {
    if (!committeeId) {
      throw new Error('Fecfile: No Committee Id provided in getCommitteeDetails()');
    }

    return this.apiService
      .get<FecApiPaginatedResponse>(`/openfec/${committeeId}/committee/`)
      .pipe(map((response) => response.results[0] as CommitteeAccount));
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
  public getCommitteeRecentFiling(committeeId: string | undefined): Observable<FecFiling | undefined> {
    if (!committeeId) {
      throw new Error('Fecfile: No Committee Id provided in getCommitteeRecentFiling()');
    }

    return this.apiService
      .get<FecFiling>(`/openfec/${committeeId}/filings/`)
      .pipe(map((response) => FecFiling.fromJSON(response)));
  }
}
