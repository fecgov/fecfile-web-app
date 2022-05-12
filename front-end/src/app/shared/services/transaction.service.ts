import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Schedule } from '../interfaces/schedule.interface';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  public get(transactionId: number): Observable<Schedule> {
    return of({ id: transactionId } as Schedule);
  }
}
