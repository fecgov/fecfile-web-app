import { INDIVIDUAL } from 'app/shared/utils/transaction-type-properties';
import { JsonSchema } from 'fecfile-validate';
import { SchATransactionType } from '../../scha-transaction-type.model';
import { Transaction } from '../../transaction.model';

// TODO - Base abstract class for Authorized Transfer Memos,
// will be implemented later, for now just using dummy data
export abstract class AuthorizedCommitteeMemo extends SchATransactionType {
  override contactTypeOptions = INDIVIDUAL;
  formFields = [];
  override schema = {} as JsonSchema;
  override getNewTransaction(): Transaction {
    throw new Error('Method not implemented.');
  }
}
