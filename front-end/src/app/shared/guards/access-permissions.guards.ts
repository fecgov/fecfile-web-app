import { Injectable } from '@angular/core';
import { CanActivate, UrlTree } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { ReportIsEditableService } from '../services/access-permissions.service';
import { selectActiveReport } from '../../store/active-report.selectors';
import { Report } from '../interfaces/report.interface';

@Injectable({
  providedIn: 'root',
})
export class ReportIsEditableGuard implements CanActivate {
  constructor(private store: Store, private editableService: ReportIsEditableService) {}

  canActivate(): Observable<boolean> {
    return this.editableService.isEditable();
  }
}
