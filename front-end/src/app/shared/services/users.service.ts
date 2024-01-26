import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { TableListService } from '../interfaces/table-list-service.interface';
import { ListRestResponse } from '../models/rest-api.model';
import { ApiService } from './api.service';
import { CommitteeUser } from '../models/user.model';
import { CommitteeAccountService } from './committee-account.service';

@Injectable({
  providedIn: 'root',
})
export class UsersService implements TableListService<CommitteeUser> {
  constructor(private apiService: ApiService, private committeeAccountService: CommitteeAccountService) {}

  public getTableData(pageNumber = 1, ordering = ''): Observable<ListRestResponse> {
    let parameter_string = `?page=${pageNumber}`;
    if (ordering?.length > 0) {
      parameter_string += `&ordering=${ordering}`;
    }
    return this.committeeAccountService.getCommittees().pipe(
      mergeMap((committees) =>
        this.apiService.get<ListRestResponse>(`/committees/${committees[0].id}/users/${parameter_string}`)
      ),
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
