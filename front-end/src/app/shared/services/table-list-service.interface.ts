import { Observable } from 'rxjs';
import { ListRestResponse } from '../models/rest-api.model';

export interface TableListService<T> {
  getTableData(pageNumber: number): Observable<ListRestResponse>;
  create(item: T): Observable<any>;
  update(item: T): Observable<any>;
  delete(item: T): Observable<null>;
}
