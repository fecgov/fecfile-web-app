import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { CommitteeAccount } from '../../models/committee-account.model';
import { FecApiPaginatedResponse } from 'app/shared/models/fec-api.model';

@Injectable({
  providedIn: 'root'
})
export class FecApiService {
  private apiKey: string | null = environment.fecApiKey;

  constructor(private http: HttpClient) { }

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
  public getDetails(committeeId: string | null): Observable<CommitteeAccount > {
    if (!committeeId) {
      throw new Error('No Committee Id provided.')
    }
    const headers = this.getHeaders();
    return this.http.get<FecApiPaginatedResponse>(`${environment.fecApiCommitteeUrl}/${committeeId}/?api_key=${this.apiKey}`, { headers: headers })
    .pipe(map((response: FecApiPaginatedResponse) => response.results[0] || undefined));
  }
}
