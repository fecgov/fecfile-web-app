import { TransactionType } from '../../interfaces/transaction-type.interface';

export abstract class SchaTransactionType extends TransactionType {
  override generatePurposeDescriptionLabel?(): string {
    if (this.generatePurposeDescription !== undefined) {
      return '(SYSTEM-GENERATED)';
    } else if (!this.purposeDescriptionUserInputRequired) {
      return '(OPTIONAL)';
    }
    return '';
  }
}
