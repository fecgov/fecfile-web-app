import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ApiService } from './api.service';
import { CashOnHand } from '../models/cash-on-hand.model';
import { HttpResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CashOnHandService {
  apiEndpoint = '/cash_on_hand';

  constructor(protected apiService: ApiService) {}

  public async getCashOnHand(year: number): Promise<CashOnHand | undefined> {
    return firstValueFrom(
      this.apiService.get<HttpResponse<CashOnHand>>(`${this.apiEndpoint}/year/${year}/`, {}, [404]),
    ).then((response) => {
      if (response.status === 404) {
        return undefined;
      }
      return CashOnHand.fromJSON(response.body);
    });
  }
  public async setCashOnHand(year: number, cashOnHand: number): Promise<CashOnHand> {
    return firstValueFrom(
      this.apiService.post<CashOnHand>(`${this.apiEndpoint}/year/${year}/`, { cash_on_hand: cashOnHand }),
    );
  }
}
