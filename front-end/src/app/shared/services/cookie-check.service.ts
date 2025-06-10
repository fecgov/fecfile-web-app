import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CookieCheckService {
  areCookiesEnabled(): boolean {
    const cookietest = 'cookietest=';
    const localtest = 'localtest';
    try {
      localStorage.setItem(localtest, localtest);
      localStorage.removeItem(localtest);

      document.cookie = cookietest + '1';
      const cookiesEnabled = document.cookie.indexOf(cookietest) !== -1;
      document.cookie = cookietest + '1; expires=Thu, 01-Jan-1970 00:00:01 GMT';
      return cookiesEnabled;
    } catch (e) {
      console.log(e);
      return false;
    }
  }
}
