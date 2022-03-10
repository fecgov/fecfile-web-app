import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { SessionService } from 'app/shared/services/SessionService/session.service';

@Injectable({
  providedIn: 'root',
})
export class TwoFactorHelperService {
  constructor(private http: HttpClient, private sessionService: SessionService) {}

  validateCode(code: string) {
    const payload: any = { code: code.toString() };
    const token: string = this.sessionService.getToken();
    const headers: any = {
      'Content-Type': 'application/json',
      token: token,
    };
    return this.http.post(`${environment.apiUrl}/user/login/verify`, payload, { headers: headers });
  }
}
