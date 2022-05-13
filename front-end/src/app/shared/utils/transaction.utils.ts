import { TransactionMeta } from '../interfaces/transaction-meta.interface';

// Import transaction schemas
import { schema as OFFSET_TO_OPEX } from 'fecfile-validate/fecfile_validate_js/dist/OFFSET_TO_OPEX';

const meta: { [transaction_type_identifier: string]: TransactionMeta } = {
  OFFSET_TO_OPEX: {
    scheduleId: 'A',
    componentGroupId: 'B',
    formType: 'SA15',
    title: 'Offsets to Operating Expenditures',
    contributionPurposeDescripReadonly: () => '',
    schema: OFFSET_TO_OPEX,
    transaction: null,
  },
};

export class TransactionUtils {
  static getMeta(transaction_type_identifier: string): TransactionMeta {
    return meta[transaction_type_identifier.toUpperCase()];
  }
}
