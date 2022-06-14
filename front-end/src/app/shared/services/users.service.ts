import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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
    if (!ordering) {
      ordering = 'name';
    }
    return this.apiService.get<ListRestResponse>(`/committee/users/?page=${pageNumber}&ordering=${ordering}`).pipe(
      map((response: ListRestResponse) => {
        response.results = response.results.map((item) => CommitteeUser.fromJSON(item));
        return response;
      })
    );
  }

  public create(user: CommitteeUser): Observable<CommitteeUser> {
    console.log('Create', user);
    return new Observable<CommitteeUser>();
  }

  public update(user: CommitteeUser): Observable<CommitteeUser> {
    console.log('Update', user);
    return new Observable<CommitteeUser>();
  }

  public delete(user: CommitteeUser): Observable<null> {
    console.log('Delete', user);
    return new Observable<null>();
  }
}
