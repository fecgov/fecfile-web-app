import { Observable } from 'rxjs';
import { ListRestResponse } from '../models/rest-api.model';

export interface TableListService<T> {
  getTableData(pageNumber: number, ordering?: string): Observable<ListRestResponse>;
  delete(item: T): Observable<null>;
}
