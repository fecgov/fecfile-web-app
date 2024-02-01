import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { TableListService } from '../interfaces/table-list-service.interface';
import { ListRestResponse } from '../models/rest-api.model';
import { CommitteeUser, UserLoginData } from '../models/user.model';
import { ApiService } from './api.service';
import { CommitteeAccountService } from './committee-account.service';

@Injectable({
  providedIn: 'root',
})
export class UsersService implements TableListService<CommitteeUser> {
  constructor(private apiService: ApiService,
    private committeeAccountService: CommitteeAccountService
  ) { }

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

  public getCurrentUser() {
    return this.apiService.get<UserLoginData>('/users/current');
  }

  public updateCurrentUser(userLoginData: UserLoginData): Observable<null> {
    return this.apiService
      .put<null>(`/users/current`, userLoginData)
      .pipe(map((response) => response));
  }

}
