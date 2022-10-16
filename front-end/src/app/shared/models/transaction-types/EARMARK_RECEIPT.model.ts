import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/EARMARK_RECEIPT';
import { TransactionTypeUtils } from 'app/shared/utils/transaction-type.utils';
import { TransactionType } from '../../interfaces/transaction-type.interface';
import {
  AggregationGroups,
  SchATransaction,
  ScheduleATransactionTypeLabels,
  ScheduleATransactionTypes,
} from '../scha-transaction.model';
import { ContactTypes } from '../contact.model';

export class EARMARK_RECEIPT implements TransactionType {
  scheduleId = 'A';
  componentGroupId = 'AG';
  title = LabelUtils.get(ScheduleATransactionTypeLabels, ScheduleATransactionTypes.EARMARK_RECEIPT);
  schema = schema;
  transaction = undefined;
  contact = undefined;
  parentTransaction = undefined;
  childTransactionType = TransactionTypeUtils.factory(ScheduleATransactionTypes.EARMARK_MEMO);

  contributionPurposeDescripReadonly(): string {
    const transaction: SchATransaction = this.childTransactionType?.transaction as SchATransaction;
    const conduit: string =
      transaction.entity_type === ContactTypes.INDIVIDUAL
        ? `${transaction.contributor_last_name || ''}, ${transaction.contributor_first_name || ''}`
        : transaction.contributor_organization_name || '';
    return `Earmarked through ${conduit} (Committee)`;
  }

  getNewTransaction() {
    return SchATransaction.fromJSON({
      form_type: 'SA11AI',
      transaction_type_identifier: ScheduleATransactionTypes.EARMARK_RECEIPT,
      aggregation_group: AggregationGroups.GENERAL,
    });
  }
}
