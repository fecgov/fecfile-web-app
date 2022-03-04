import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable()
export class AppConfigService {
  private appConfig: any;

  constructor(private http: HttpClient) {}

  loadAppConfig() {
    return this.http
      .get('/assets/data/appConfig.json')
      .subscribe((data: any) => {
        data['apiUrl'] = environment.apiUrl;
        this.appConfig = data;
      });
  }

  getConfig() {
    return this.appConfig;
  }
}
