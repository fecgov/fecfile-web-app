import { Injectable } from '@angular/core';
import { CanActivate, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectCohNeededStatus } from 'app/store/coh-needed.selectors';

@Injectable({
  providedIn: 'root',
})
export class CashOnHandGuard implements CanActivate {
  constructor(private store: Store) {}

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.store.select(selectCohNeededStatus);
  }
}
