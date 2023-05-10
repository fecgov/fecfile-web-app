import { PrimeOptions } from 'app/shared/utils/label.utils';
import { TransactionTemplateMapType } from '../transaction-type.model';

export abstract class DoubleTransactionGroup {
  abstract getFormProperties(templateMap: TransactionTemplateMapType): string[];
  abstract getChildFormProperties(childTemplateMap: TransactionTemplateMapType): string[];

  abstract getContactTypeOptions(): PrimeOptions;
  abstract getChildContactTypeOptions(): PrimeOptions;

  abstract hasEmployerInput(): boolean;

  abstract getChildTransactionTitle(): string;
}
