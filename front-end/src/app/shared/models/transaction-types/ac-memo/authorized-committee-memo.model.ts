import { SchATransactionType } from '../../scha-transaction-type.model';
import { TemplateMapKeyType } from '../../transaction-type.model';
import { Transaction } from '../../transaction.model';

export abstract class AuthorizedCommitteeMemo extends SchATransactionType {
  override inheritedFields = ['election_code', 'election_other_description'] as TemplateMapKeyType[];

  override generatePurposeDescription(transaction: Transaction): string {
    return `Authorized Committee Memo: ${transaction.parent_transaction?.contact_1?.name}`;
  }
}
