import { schema } from 'fecfile-validate/fecfile_validate_js/dist/CONDUIT_EARMARKS';
import { SchATransaction, ScheduleATransactionTypes } from '../scha-transaction.model';
import { SchBTransaction, ScheduleBTransactionTypes } from '../schb-transaction.model';
import { INDIVIDUAL_WITH_EMPLOYEE_B_FORM_FIELDS, INDIVIDUAL } from 'app/shared/utils/transaction-type-properties';
import { CONDUIT_EARMARK } from './common-types/CONDUIT_EARMARK.model';

export class CONDUIT_EARMARK_RECEIPT extends CONDUIT_EARMARK {
  formFields = INDIVIDUAL_WITH_EMPLOYEE_B_FORM_FIELDS;
  contactTypeOptions = INDIVIDUAL;
  title = 'Conduit Earmark';
  schema = schema;
  override dependentChildTransactionType = [ScheduleBTransactionTypes.CONDUIT_EARMARK_OUT];
  override memoCodeTransactionTypes = {
    true: ScheduleATransactionTypes.CONDUIT_EARMARK_RECEIPT_UNDEPOSITED,
    false: ScheduleATransactionTypes.CONDUIT_EARMARK_RECEIPT_DEPOSITED,
  };

  override generatePurposeDescription(transaction: SchATransaction): string {
    if (!transaction.children?.length) return '';
    const earmarkMemo: SchBTransaction = transaction.children[0] as SchBTransaction;
    if (earmarkMemo.payee_organization_name) {
      const conduit = earmarkMemo.payee_organization_name;
      return `Earmarked for ${conduit} (Committee)`;
    }
    return '';
  }

  getNewTransaction() {
    return SchATransaction.fromJSON({
      form_type: 'SA11AI',
      transaction_type_identifier: ScheduleATransactionTypes.CONDUIT_EARMARK_RECEIPT_DEPOSITED,
      memo_code: false,
    });
  }
}
