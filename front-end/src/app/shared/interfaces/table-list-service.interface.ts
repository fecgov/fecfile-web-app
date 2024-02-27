import { Observable } from 'rxjs';
import { ListRestResponse } from '../models/rest-api.model';

export interface TableListService<T> {
  getTableData(
    pageNumber: number,
    ordering?: string,
    params?: { [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean> },
  ): Observable<ListRestResponse>;

  delete(item: T): Observable<null>;

  update?(item: T, fieldsToValidate?: string[]): Observable<T>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function clearEmptyKeys(obj: Record<string, any>) {
  for (const key of Object.keys(obj)) {
    if (!obj[key] || (typeof obj[key] === 'object' && Object.keys(obj[key]).length === 0)) delete obj[key];
  }
}
