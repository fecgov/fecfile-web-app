import { PrimeOptions } from 'app/shared/utils/label.utils';
import { ContactTypes } from '../contact.model';
import { TransactionTemplateMapType } from '../transaction-type.model';

export interface TransactionGroup {
  getFormProperties(
    templateMap: TransactionTemplateMapType,
    scheduleId: string
  ): string[];
  getContactTypeOptions(): PrimeOptions;
  hasEmployerInput(entityType: ContactTypes, scheduleId: string): boolean;
  hasCommitteeFecIdInput(): boolean;
  hasElectionInformationInput(): boolean;
  getAmountInputTitle(): string;
}
