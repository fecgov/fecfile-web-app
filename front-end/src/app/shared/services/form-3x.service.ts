import { Injectable } from '@angular/core';
import { Form3X } from '../models';
import { DateUtils } from '../utils/date.utils';
import { BaseForm3Service } from './base-form-3.service';

@Injectable()
export class Form3XService extends BaseForm3Service<Form3X> {
  override apiEndpoint = '/reports/form-3x';

  public async getAssociatedForm3xReport(
    disbursementDate?: Date,
    disseminationDate?: Date,
  ): Promise<Form3X | undefined> {
    const disbursementDateString = disbursementDate ? DateUtils.convertDateToFecFormat(disbursementDate) : '';
    const disseminationDateString = disseminationDate ? DateUtils.convertDateToFecFormat(disseminationDate) : '';
    const url = `${this.apiEndpoint}/associated/?disbursement_date=${disbursementDateString}&dissemination_date=${disseminationDateString}`;
    return await this.apiService.get<Form3X | undefined>(url);
  }
}
