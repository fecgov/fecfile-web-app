import { HttpClient, HttpContext, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiService, getHeaders } from 'app/shared/services/api.service';

@Injectable({
  providedIn: 'root',
})
export class ImportService {}
