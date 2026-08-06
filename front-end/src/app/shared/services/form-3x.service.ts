import { Injectable } from '@angular/core';
import { BaseForm3Service } from './base-form-3.service';
import type { Form3X } from '../models/reports/form-3x.model';

@Injectable({
  providedIn: 'root',
})
export class Form3XService extends BaseForm3Service<Form3X> {
  override apiEndpoint = '/reports/form-3x';
}
