import { inject, Injectable } from '@angular/core';
import { UserLoginData } from '../models/user.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private readonly apiService = inject(ApiService);

  public getCurrentUser(): Promise<UserLoginData> {
    return this.apiService.get<UserLoginData>(`/users/get_current/`);
  }

  public updateCurrentUser(userLoginData: UserLoginData): Promise<UserLoginData> {
    return this.apiService.put<UserLoginData>(`/users/update_current/`, userLoginData);
  }
}
