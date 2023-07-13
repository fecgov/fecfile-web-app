import { LabelUtils, PrimeOptions } from 'app/shared/utils/label.utils';
import { ContactTypeLabels, ContactTypes } from '../contact.model';
import { TransactionTemplateMapType } from '../transaction-type.model';
import { TransactionGroup } from './transaction-group.model';

export class TransactionGroupR extends TransactionGroup {
  getFormProperties(templateMap: TransactionTemplateMapType): string[] {
    return [
      'entity_type',
      templateMap.organization_name,
      templateMap.street_1,
      templateMap.street_2,
      templateMap.city,
      templateMap.state,
      templateMap.zip,
      templateMap.election_code,
      templateMap.election_other_description,
      templateMap.date,
      templateMap.amount,
      templateMap.aggregate,
      templateMap.purpose_description,
      templateMap.category_code,
      templateMap.memo_code,
      templateMap.text4000,
    ].filter((val) => !!val);
  }

  getContactTypeOptions(): PrimeOptions {
    return LabelUtils.getPrimeOptions(ContactTypeLabels, [ContactTypes.ORGANIZATION]);
  }

  hasEmployerInput(): boolean {
    return false;
  }

  hasCommitteeFecIdInput(): boolean {
    return false;
  }

  hasElectionInformationInput(): boolean {
    return true;
  }

  hasCandidateInformationInput(): boolean {
    return false;
  }

  hasCandidateCommitteeInput(): boolean {
    return false;
  }

  hasCandidateOfficeInput(): boolean {
    return true;
  }
}
