import { TransactionType } from './transaction-type.model';
import { SchBTransaction } from '../schb-transaction.model';

export abstract class SchbTransactionType extends TransactionType {
  scheduleId = 'B';
  override transaction?: SchBTransaction;

  override generatePurposeDescriptionLabel(): string {
    if (this.generatePurposeDescription !== undefined) {
      return '(SYSTEM-GENERATED)';
    } else if (this.schema.required.includes('expenditure_purpose_descrip')) {
      return '(REQUIRED)';
    }
    return '(OPTIONAL)';
  }
}
