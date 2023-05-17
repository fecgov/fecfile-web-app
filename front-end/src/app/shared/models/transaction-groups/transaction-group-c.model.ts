import { LabelUtils, PrimeOptions } from 'app/shared/utils/label.utils';
import { ContactTypeLabels, ContactTypes } from '../contact.model';
import { TransactionTemplateMapType } from '../transaction-type.model';
import { TransactionGroup } from './transaction-group.model';

export class TransactionGroupC extends TransactionGroup {
  getFormProperties(templateMap: TransactionTemplateMapType): string[] {
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
      templateMap.employer,
      templateMap.occupation,
      templateMap.memo_code,
      templateMap.memo_text_description,
      templateMap.category_code,
      'subTransaction',
    ].filter((val) => !!val);
  }

  getContactTypeOptions(): PrimeOptions {
    return LabelUtils.getPrimeOptions(ContactTypeLabels, [
      ContactTypes.INDIVIDUAL,
      ContactTypes.ORGANIZATION,
      ContactTypes.COMMITTEE,
    ]);
  }

  hasEmployerInput(entityType: ContactTypes, scheduleId: string): boolean {
    return ContactTypes.INDIVIDUAL === entityType && 'B' !== scheduleId;
  }

  hasCommitteeFecIdInput(): boolean {
    return false;
  }

  hasElectionInformationInput(): boolean {
    return false;
  }
}
