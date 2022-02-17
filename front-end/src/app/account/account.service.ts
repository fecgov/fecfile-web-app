import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class AccountService {
  constructor(private http: HttpClient, private cookieService: CookieService) {}

  getAccounts(): Observable<any> {
    const token: string = JSON.parse(this.cookieService.get('user'));
    let httpOptions = new HttpHeaders();

    const url = '/core/get_committee_details';

    httpOptions = httpOptions.append('Content-Type', 'application/json');
    httpOptions = httpOptions.append('Authorization', 'JWT ' + token);

    return this.http.get(`${environment.apiUrl}${url}`, {
      headers: httpOptions,
    });
  }
}
