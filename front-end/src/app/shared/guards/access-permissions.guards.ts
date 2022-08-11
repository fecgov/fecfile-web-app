import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { ReportIsEditableService } from '../services/access-permissions.service';

@Injectable({
  providedIn: 'root',
})
export class ReportIsEditableGuard implements CanActivate {
  constructor(private editableService: ReportIsEditableService) {}

  canActivate(): Observable<boolean> {
    const observe = this.editableService.isEditable();
    return observe;
  }
}
