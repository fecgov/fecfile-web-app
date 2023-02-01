import { TransactionType } from './transaction-type.model';
import { SchATransaction } from '../scha-transaction.model';

export abstract class SchaTransactionType extends TransactionType {
  scheduleId = 'A';
  override transaction?: SchATransaction;

  override generatePurposeDescriptionLabel(): string {
    if (this.generatePurposeDescriptionWrapper !== undefined) {
      return '(SYSTEM-GENERATED)';
    } else if (this.schema.required.includes('contribution_purpose_descrip')) {
      return '(REQUIRED)';
    }
    return '(OPTIONAL)';
  }
}
