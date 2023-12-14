import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Observable, map } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectCashOnHand } from 'app/store/cash-on-hand.selectors';
import { CashOnHand } from '../models/form-3x.model';

@Injectable({
  providedIn: 'root',
})
export class CashOnHandGuard {
  constructor(private store: Store) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    return this.store.select(selectCashOnHand).pipe(
      map((cashOnHand: CashOnHand) => {
        const reportId = route.paramMap.get('reportId');
        if (reportId) {
          return reportId === cashOnHand.report_id;
        }
        return false;
      })
    );
  }
}
