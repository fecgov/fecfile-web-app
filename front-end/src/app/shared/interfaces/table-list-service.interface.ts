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
  updateString?(item: T, fieldsToValidate?: string[]): Promise<string>;
}
