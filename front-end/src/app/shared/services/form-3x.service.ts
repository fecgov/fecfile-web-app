import { Injectable } from '@angular/core';
import { Form3X } from '../models';
import { BaseForm3Service } from './base-form-3.service';

@Injectable()
export class Form3XService extends BaseForm3Service<Form3X> {
  override apiEndpoint = '/reports/form-3x';
}
