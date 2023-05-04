import { LabelUtils, PrimeOptions } from 'app/shared/utils/label.utils';
import { ContactTypeLabels, ContactTypes } from '../contact.model';
import { TransactionTemplateMapType } from '../transaction-type.model';
import { DoubleTransactionGroup } from './double-transaction-group.interface';

export class TransactionGroupFG implements DoubleTransactionGroup {
  getFormProperties(templateMap: TransactionTemplateMapType): string[] {
    return [
      'entity_type',
      templateMap.organization_name,
      templateMap.street_1,
      templateMap.street_2,
      templateMap.city,
      templateMap.state,
      templateMap.zip,
      templateMap.date,
      templateMap.amount,
      templateMap.aggregate,
      templateMap.purpose_description,
      templateMap.committee_fec_id,
      templateMap.committee_name,
      templateMap.memo_code,
      templateMap.memo_text_input,
    ].filter(val => !!val);
  }

  getChildFormProperties(childTemplateMap: TransactionTemplateMapType): string[] {
    return [
      'entity_type',
      childTemplateMap.organization_name,
      childTemplateMap.last_name,
      childTemplateMap.first_name,
      childTemplateMap.middle_name,
      childTemplateMap.prefix,
      childTemplateMap.suffix,
      childTemplateMap.street_1,
      childTemplateMap.street_2,
      childTemplateMap.city,
      childTemplateMap.state,
      childTemplateMap.zip,
      childTemplateMap.date,
      childTemplateMap.amount,
      childTemplateMap.aggregate,
      childTemplateMap.purpose_description,
      childTemplateMap.employer,
      childTemplateMap.occupation,
      childTemplateMap.committee_fec_id,
      childTemplateMap.committee_name,
      childTemplateMap.memo_code,
      childTemplateMap.memo_text_input,
    ].filter(val => !!val);
  }

  getContactTypeOptions(): PrimeOptions {
    return LabelUtils.getPrimeOptions(ContactTypeLabels, [
      ContactTypes.COMMITTEE,
    ]);
  }

  getChildContactTypeOptions(): PrimeOptions {
    return LabelUtils.getPrimeOptions(ContactTypeLabels, [
      ContactTypes.INDIVIDUAL,
      ContactTypes.COMMITTEE,
    ]);
  }

  hasEmployerInput(): boolean {
    return false;
  }

  getChildTransactionTitle(): string {
    return 'PAC Earmark memo';
  }
}
