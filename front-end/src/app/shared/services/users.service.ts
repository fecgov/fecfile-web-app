import { Injectable } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserLoginData } from '../models/user.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(private apiService: ApiService) { }

  public getCurrentUser(): Promise<UserLoginData> {
    return firstValueFrom(
      this.apiService.get<UserLoginData>(`/users/current/`).pipe(map((response) => response))
    )
  }

  public updateCurrentUser(userLoginData: UserLoginData): Observable<UserLoginData> {
    return this.apiService.put<UserLoginData>(`/users/current/`, userLoginData).pipe(map((response) => response));
  }
}
