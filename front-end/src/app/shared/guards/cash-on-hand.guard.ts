import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate } from '@angular/router';
import { Observable, map } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectCashOnHand } from 'app/store/cash-on-hand.selectors';
import { CashOnHand } from '../interfaces/report.interface';

@Injectable({
  providedIn: 'root',
})
export class CashOnHandGuard implements CanActivate {
  constructor(private store: Store) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    return this.store.select(selectCashOnHand).pipe(
      map((cashOnHand: CashOnHand) => {
        const reportId = String(route.paramMap.get('reportId'));
        if (reportId !== null) {
          return reportId === cashOnHand.report_id;
        }
        return false;
      })
    );
  }
}
