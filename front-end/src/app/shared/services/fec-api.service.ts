import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { CommitteeAccount } from '../models/committee-account.model';
import { FecApiPaginatedResponse } from 'app/shared/models/fec-api.model';
import { FecFiling } from '../models/fec-filing.model';

@Injectable({
  providedIn: 'root',
})
export class FecApiService {
  private apiKey: string | null = environment.fecApiKey;

  constructor(private http: HttpClient) {}

  getHeaders() {
    return {
      'Content-Type': 'application/json',
    };
  }

  getQueryParams(
    queryParams: { [param: string]: string | number | boolean | readonly (string | number | boolean)[] } = {}
  ) {
    const allParams = { ...{ apiKey: this.apiKey }, ...queryParams };
    return new HttpParams({ fromObject: queryParams });
  }

  /**
   * Gets the commitee account details.
   *
   * @return     {Observable}  The commitee details.
   */
  public getDetails(committeeId: string | null): Observable<CommitteeAccount> {
    if (!committeeId) {
      throw new Error('No Committee Id provided.');
    }
    const headers = this.getHeaders();
    const params = this.getQueryParams();
    return this.http
      .get<FecApiPaginatedResponse>(`${environment.fecApiUrl}/committee/${committeeId}/`, {
        headers: headers,
        params: params,
      })
      .pipe(map((response: FecApiPaginatedResponse) => (response.results[0] as CommitteeAccount) || undefined));
  }

  public getCommitteeRecentFiling(committeeId: string | null): Observable<FecFiling> {
    if (!committeeId) {
      throw new Error('No Committee Id provided.');
    }
    const headers = this.getHeaders();
    const nightlyEndpointParams = this.getQueryParams({
      sort: '-receipt_date',
      per_page: 1,
      page: 1,
      committee_id: committeeId,
      form_type: 'F1',
    });
    const realTimeEndpointParams = this.getQueryParams({
      committee_id: committeeId,

    })
    const nightlyEndpoint = this.http.get<FecApiPaginatedResponse>(`${environment.fecApiUrl}/filing`, {
      headers: headers,
      params: nightlyEndpointParams,
    });
    const realTimeEndpoint = this.http.get<FecApiPaginatedResponse>(`${environment.fecApiUrl}/efile/filings/`, {
      headers: headers,
      params: realTimeEndpointParams
    }).pipe(map((response: FecApiPaginatedResponse) => {
      response.results.find(filing: FecFiling => filing['form_type'].startsWith('F1'))
    }));

    
  }
}
