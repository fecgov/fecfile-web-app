import { PrimeOptions } from 'app/shared/utils/label.utils';
import { ContactTypes } from '../contact.model';
import { TransactionTemplateMapType } from '../transaction-type.model';

export abstract class TransactionGroup {
  abstract getFormProperties(
    templateMap: TransactionTemplateMapType,
    scheduleId: string
  ): string[];
  abstract getContactTypeOptions(): PrimeOptions;
  abstract hasEmployerInput(entityType: ContactTypes, scheduleId: string): boolean;
  abstract hasCommitteeFecIdInput(entityType?: ContactTypes): boolean;
  abstract hasElectionInformationInput(): boolean;
  abstract hasCandidateInformationInput(): boolean;
  abstract hasCandidateCommitteeInput(): boolean;
  abstract hasCandidateOfficeInput(): boolean;
}
