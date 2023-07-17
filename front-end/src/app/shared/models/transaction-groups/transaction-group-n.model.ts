import { LabelUtils, PrimeOptions } from 'app/shared/utils/label.utils';
import { ContactTypeLabels, ContactTypes } from '../contact.model';
import { TransactionTemplateMapType } from '../transaction-type.model';
import { TransactionGroup } from './transaction-group.model';

export class TransactionGroupN extends TransactionGroup {
  getFormProperties(templateMap: TransactionTemplateMapType): string[] {
    return [
      'entity_type',
      templateMap.first_name,
      templateMap.last_name,
      templateMap.middle_name,
      templateMap.suffix,
      templateMap.prefix,
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
      templateMap.purpose_description,
      templateMap.category_code,
      templateMap.committee_fec_id,
      templateMap.committee_name,
      templateMap.candidate_fec_id,
      templateMap.candidate_last_name,
      templateMap.candidate_first_name,
      templateMap.candidate_middle_name,
      templateMap.candidate_prefix,
      templateMap.candidate_suffix,
      templateMap.candidate_office,
      templateMap.candidate_state,
      templateMap.candidate_district,
      templateMap.memo_code,
      templateMap.text4000,
    ].filter((val) => !!val);
  }

  getContactTypeOptions(): PrimeOptions {
    return LabelUtils.getPrimeOptions(ContactTypeLabels, [ContactTypes.ORGANIZATION, ContactTypes.INDIVIDUAL]);
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
    return true;
  }

  hasCandidateCommitteeInput(): boolean {
    return true;
  }

  hasCandidateOfficeInput(): boolean {
    return true;
  }
}
