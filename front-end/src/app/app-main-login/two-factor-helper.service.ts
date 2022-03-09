import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class TwoFactorHelperService {
  constructor(private http: HttpClient) {}

  validateCode(code: string) {
    const option: any = { code: code.toString() };

    return this.http.post(`${environment.apiUrl}/user/login/verify`, option).pipe(
      map((res) => {
        if (res) {
          return res;
        }
        return false;
      })
    );
  }
}
