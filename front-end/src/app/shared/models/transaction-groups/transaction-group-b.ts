import { LabelUtils, PrimeOptions } from 'app/shared/utils/label.utils';
import { ContactTypeLabels, ContactTypes } from '../contact.model';
import { TransactionTemplateMapType } from '../transaction-type.model';
import { TransactionGroup } from './transaction-group.interface';

export class TransactionGroupB extends TransactionGroup {
  getFormProperties(
    templateMap: TransactionTemplateMapType,
    scheduleId: string
  ): string[] {
    switch (scheduleId) {
      case 'B':
        return [
          'entity_type',
          templateMap.organization_name,
          templateMap.last_name,
          templateMap.first_name,
          templateMap.middle_name,
          templateMap.prefix,
          templateMap.suffix,
          templateMap.street_1,
          templateMap.street_2,
          templateMap.city,
          templateMap.state,
          templateMap.zip,
          templateMap.date,
          templateMap.amount,
          templateMap.aggregate,
          templateMap.purpose_description,
          templateMap.memo_code,
          templateMap.memo_text_input,
          templateMap.category_code,
        ].filter(val => !!val);

      default:
        return [
          'entity_type',
          templateMap.organization_name,
          templateMap.last_name,
          templateMap.first_name,
          templateMap.middle_name,
          templateMap.prefix,
          templateMap.suffix,
          templateMap.street_1,
          templateMap.street_2,
          templateMap.city,
          templateMap.state,
          templateMap.zip,
          templateMap.date,
          templateMap.amount,
          templateMap.aggregate,
          templateMap.purpose_description,
          templateMap.memo_code,
          templateMap.memo_text_input,
        ].filter(val => !!val);
    }
  }

  getContactTypeOptions(): PrimeOptions {
    return LabelUtils.getPrimeOptions(ContactTypeLabels, [
      ContactTypes.INDIVIDUAL,
      ContactTypes.ORGANIZATION,
      ContactTypes.COMMITTEE,
    ]);
  }

  hasEmployerInput(): boolean {
    return false
  }

  hasCommitteeFecIdInput(): boolean {
    return false;
  }

  hasElectionInformationInput(): boolean {
    return false;
  }

  getAmountInputTitle(): string {
    return 'Receipt Information';
  }
}