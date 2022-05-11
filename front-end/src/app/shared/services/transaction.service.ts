import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Schedule } from '../interfaces/schedule.interface';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  constructor() {}

  public get(transactionId: number): Observable<Schedule> {
    return of({} as Schedule);
  }
}
