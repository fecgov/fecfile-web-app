import { Injectable } from '@angular/core';
import { Form3 } from '../models/reports/form-3.model';
import { BaseForm3Service } from './base-form-3.service';

@Injectable({
  providedIn: 'root',
})
export class Form3Service extends BaseForm3Service<Form3> {
  override apiEndpoint = '/reports/form-3';
}
