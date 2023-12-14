import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Observable, map, of } from 'rxjs';
import { Store } from '@ngrx/store';
import { ReportService } from '../services/report.service';

@Injectable({
  providedIn: 'root',
})
export class CashOnHandGuard {
  constructor(private reportService: ReportService) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    return this.reportService
      .get(route.paramMap.get('reportId') ?? '')
      .pipe(map((report) => report?.is_first ?? false));
  }
}
