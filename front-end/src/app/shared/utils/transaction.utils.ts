import { TransactionMeta } from '../interfaces/transaction-meta.interface';

// Transaction schemas
import { schema as OFFSET_TO_OPEX } from 'fecfile-validate/fecfile_validate_js/dist/OFFSET_TO_OPEX';

// Transaction models
import { SchATransaction } from '../models/scha-transaction.model';

const meta: { [transaction_type_identifier: string]: TransactionMeta } = {
  OFFSET_TO_OPEX: {
    scheduleId: 'A',
    componentGroupId: 'B',
    title: 'Offsets to Operating Expenditures',
    contributionPurposeDescripReadonly: () => '',
    schema: OFFSET_TO_OPEX,
    factory: () => SchATransaction.fromJSON({
      form_type: 'SA15',
      transaction_type_identifier: 'OFFSET_TO_OPEX',
    }),
    transaction: null,
  },
};

export class TransactionUtils {
  static getMeta(transaction_type_identifier: string): TransactionMeta {
    return meta[transaction_type_identifier.toUpperCase()];
  }
}
