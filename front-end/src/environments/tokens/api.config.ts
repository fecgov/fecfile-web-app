import { InjectionToken } from '@angular/core';

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

export const API_CONFIG = new InjectionToken<ApiConfig>('API_CONFIG');
