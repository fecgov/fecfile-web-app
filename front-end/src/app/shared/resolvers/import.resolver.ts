import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Import } from '../models/import.model';
import { ImportService } from '../services/import.service';

@Injectable({
  providedIn: 'root',
})
export class ImportResolver {
  private readonly importService = inject(ImportService);

  /**
   * Returns the report record for the id passed in the URL
   * @param {ActivatedRouteSnapshot} route
   * @returns {Observable<Import | undefined>}
   */
  async resolve(route: ActivatedRouteSnapshot): Promise<Import | undefined> {
    const importId = String(route.paramMap.get('importId'));
    if (!importId) {
      return undefined;
    }
    return this.importService.get(importId);
  }
}
