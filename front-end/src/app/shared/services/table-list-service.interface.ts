import { Observable } from 'rxjs';
import { ListRestResponse } from '../models/rest-api.model';

export interface TableListService<T> {
  getTableData(pageNumber: number): Observable<ListRestResponse>;
  create(item: T): Observable<T>;
  update(item: T): Observable<T>;
  delete(item: T): Observable<null>;
}
