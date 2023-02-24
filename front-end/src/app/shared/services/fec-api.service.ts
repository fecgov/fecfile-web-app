import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FecApiPaginatedResponse } from 'app/shared/models/fec-api.model';
import { map, Observable, of, switchMap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Candidate } from '../models/candidate.model';
import { CommitteeAccount } from '../models/committee-account.model';
import { FecFiling } from '../models/fec-filing.model';

export type QueryParamsType = { [param: string]: string | number | boolean | readonly (string | number | boolean)[] };

@Injectable({
  providedIn: 'root',
})
export class FecApiService {
  private apiKey: string | null = environment.fecApiKey;

  constructor(private http: HttpClient) { }

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
    const headers = this.getHeaders();
    const params = this.getQueryParams();
    return this.http
      .get<FecApiPaginatedResponse>(`${environment.fecApiUrl}committee/${committeeId}/`, {
        headers: headers,
        params: params,
      })
      .pipe(map((response: FecApiPaginatedResponse) => (response.results[0] as CommitteeAccount) || undefined));
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
    const headers = this.getHeaders();
    const nightlyEndpointParams = this.getQueryParams({
      sort: '-receipt_date',
      per_page: 1,
      page: 1,
      committee_id: committeeId,
      form_type: 'F1',
    });

    const nightlyEndpoint = this.http
      .get<FecApiPaginatedResponse>(`${environment.fecApiUrl}filings/`, {
        headers: headers,
        params: nightlyEndpointParams,
      })
      .pipe(
        map((response: FecApiPaginatedResponse) => {
          return (response.results as FecFiling[]).find((filing: FecFiling) => filing.form_type?.startsWith('F1'));
        })
      );

    const realTimeEndpoint = this.http
      .get<FecApiPaginatedResponse>(`${environment.fecApiUrl}efile/filings/`, {
        headers: headers,
        params: this.getQueryParams({
          committee_id: committeeId,
          sort: '-receipt_date',
        }),
      })
      .pipe(
        map((response: FecApiPaginatedResponse) => {
          return (response.results as FecFiling[]).find((filing: FecFiling) => filing.form_type?.startsWith('F1'));
        })
      );

    // Check real time endpoint for result. If it doesn't have one, check the nightly endpoint
    return realTimeEndpoint.pipe(
      switchMap((realTimeResult) => {
        if (realTimeResult) {
          return of(realTimeResult);
        }
        return nightlyEndpoint;
      })
    );
  }
}
