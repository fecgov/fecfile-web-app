import { PrimeOptions } from 'app/shared/utils/label.utils';
import { TransactionTemplateMapType } from '../transaction-type.model';

export interface DoubleTransactionGroup {
  getFormProperties(templateMap: TransactionTemplateMapType): string[];
  getChildFormProperties(childTemplateMap: TransactionTemplateMapType): string[];

  getContactTypeOptions(): PrimeOptions;
  getChildContactTypeOptions(): PrimeOptions;

  hasEmployerInput(): boolean;

  getChildTransactionTitle(): string;
}
