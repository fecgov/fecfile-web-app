import { LabelUtils, PrimeOptions } from 'app/shared/utils/label.utils';
import { ContactTypeLabels, ContactTypes } from '../contact.model';
import { TransactionTemplateMapType } from '../transaction-type.model';
import { DoubleTransactionGroup } from './double-transaction-group.model';

export class TransactionGroupAG extends DoubleTransactionGroup {
  getFormProperties(templateMap: TransactionTemplateMapType): string[] {
    return [
      'entity_type',
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
    ].filter((val) => !!val);
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
      childTemplateMap.memo_text_description,
    ].filter((val) => !!val);
  }

  getContactTypeOptions(): PrimeOptions {
    return LabelUtils.getPrimeOptions(ContactTypeLabels, [ContactTypes.INDIVIDUAL]);
  }

  getChildContactTypeOptions(): PrimeOptions {
    return LabelUtils.getPrimeOptions(ContactTypeLabels, [ContactTypes.INDIVIDUAL, ContactTypes.COMMITTEE]);
  }

  hasEmployerInput(): boolean {
    return true;
  }

  getChildTransactionTitle(): string {
    return 'Earmark memo';
  }
}
