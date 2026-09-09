import { InjectionToken } from '@angular/core';
import { environment } from 'environments/environment';

export interface ApiConfig {
  name: string;
  baseUri: string;
  apiUrl: string;
  loginDotGovAuthUrl: string;
  loginDotGovLogoutUrl: string;
  ffapiTimeoutCookieName: string;
  form1Link: string;
  whoCanUseLink: string;
  webForms: string;
  disableLogin: boolean;
  environmentBanner?: 'development' | 'stage' | 'test';
}

export const API_CONFIG = new InjectionToken<ApiConfig>('API_CONFIG', {
  providedIn: 'root',
  factory: () => ({
    name: environment.name,
    baseUri: environment.baseUri,
    apiUrl: environment.apiUrl,
    loginDotGovAuthUrl: environment.loginDotGovAuthUrl,
    loginDotGovLogoutUrl: environment.loginDotGovLogoutUrl,
    ffapiTimeoutCookieName: environment.ffapiTimeoutCookieName,
    form1Link: environment.form1Link,
    whoCanUseLink: environment.whoCanUseLink,
    webForms: environment.webForms,
    disableLogin: environment.disableLogin,
    environmentBanner: environment.environmentBanner,
  }),
});
