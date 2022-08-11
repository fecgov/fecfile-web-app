import { Injectable } from '@angular/core';
import { CanActivate, UrlTree } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { ReportIsEditable } from '../services/access-permissions.service';
import { selectActiveReport } from '../../store/active-report.selectors';
import { Report } from '../interfaces/report.interface';

@Injectable({
  providedIn: 'root',
})
export class ReportIsEditableGuard implements CanActivate {
  constructor(private store: Store) {}

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return new Observable<boolean>(()=>{
      return this.store.select(selectActiveReport).subscribe((report: Report | null)=>{
        if (report){
          const bool = ReportIsEditable(report);
          console.log("LISTEN", bool);
          return bool
        }
        return false
      });
    });
  }
}
