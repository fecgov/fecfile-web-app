import { Injectable } from '@angular/core';
import { CanActivate, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectActiveReport } from '../../store/active-report.selectors';

@Injectable({
  providedIn: 'root',
})
export class ReportIsEditable implements CanActivate {
  constructor(private store: Store) {}

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return new Observable<boolean>(()=>{
      let report = this.store.select(selectActiveReport);
      return report.subscribe((report)=>{
        return !report?.upload_status?.status;
      });
    });
  }
}
