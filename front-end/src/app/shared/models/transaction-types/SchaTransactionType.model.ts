import { TransactionType } from './transaction-type.model';

export abstract class SchaTransactionType extends TransactionType {
  override generatePurposeDescriptionLabel(): string {
    if (this.generatePurposeDescription !== undefined) {
      return '(SYSTEM-GENERATED)';
    } else if (this.schema.required.includes('contribution_purpose_descrip')) {
      return '(REQUIRED)';
    }
    return '(OPTIONAL)';
  }
}
