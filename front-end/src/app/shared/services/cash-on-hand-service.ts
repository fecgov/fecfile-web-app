import { inject, Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { CashOnHand } from '../models/cash-on-hand.model';
import { HttpResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CashOnHandService {
  private readonly apiService = inject(ApiService);
  readonly apiEndpoint = '/cash_on_hand';

  public async getCashOnHand(year: number): Promise<CashOnHand | undefined> {
    const response = await this.apiService.get<HttpResponse<CashOnHand>>(`${this.apiEndpoint}/year/${year}/`, {}, [
      404,
    ]);
    if (response.status === 404) {
      return undefined;
    }
    return CashOnHand.fromJSON(response.body);
  }
  public async setCashOnHand(year: number, cashOnHand: number): Promise<CashOnHand> {
    return this.apiService.post<CashOnHand>(`${this.apiEndpoint}/year/${year}/`, { cash_on_hand: cashOnHand });
  }
}
