import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { TableListService } from '../interfaces/table-list-service.interface';
import { ListRestResponse } from '../models/rest-api.model';
import { ApiService } from './api.service';
import { CommitteeUser } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UsersService implements TableListService<CommitteeUser> {
  constructor(private apiService: ApiService) {}

  public getTableData(pageNumber = 1, ordering = ''): Observable<ListRestResponse> {
    let parameter_string = `?page=${pageNumber}`;
    if (ordering?.length > 0) {
      parameter_string += `&ordering=${ordering}`;
    }
    return this.apiService.get<ListRestResponse>(`/committee/users/${parameter_string}`).pipe(
      map((response: ListRestResponse) => {
        response.results = response.results.map((item) => CommitteeUser.fromJSON(item));
        return response;
      })
    );
  }

  // prettier-ignore
  public delete(_user: CommitteeUser): Observable<null> { // eslint-disable-line @typescript-eslint/no-unused-vars
    return of(null);
  }
}
