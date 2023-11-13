import { schema } from 'fecfile-validate/fecfile_validate_js/dist/PAC_CONDUIT_EARMARKS';
import { SchATransaction, ScheduleATransactionTypes } from '../scha-transaction.model';
import { SchBTransaction, ScheduleBTransactionTypes } from '../schb-transaction.model';
import { COMMITTEE, COMMITTEE_NO_AGGREGATE_FORM_FIELDS } from 'app/shared/utils/transaction-type-properties';
import { CONDUIT_EARMARK } from './common-types/CONDUIT_EARMARK.model';

export class PAC_CONDUIT_EARMARK extends CONDUIT_EARMARK {
  formFields = COMMITTEE_NO_AGGREGATE_FORM_FIELDS;
  contactTypeOptions = COMMITTEE;
  title = 'PAC Conduit Earmark';
  schema = schema;
  override dependentChildTransactionTypes = [ScheduleBTransactionTypes.PAC_CONDUIT_EARMARK_OUT];
  override memoCodeTransactionTypes = {
    true: ScheduleATransactionTypes.PAC_CONDUIT_EARMARK_RECEIPT_UNDEPOSITED,
    false: ScheduleATransactionTypes.PAC_CONDUIT_EARMARK_RECEIPT_DEPOSITED,
  };
  override generatePurposeDescription(transaction: SchATransaction): string {
    if (!transaction.children?.length) return '';
    const earmarkMemo: SchBTransaction = transaction.children[0] as SchBTransaction;
    const conduit = earmarkMemo.payee_organization_name;
    if (conduit) {
      return `Earmarked for ${conduit} (Committee)`;
    }
    return '';
  }
  getNewTransaction(properties = {}) {
    return SchATransaction.fromJSON({
      ...{
        form_type: 'SA11C',
        transaction_type_identifier: ScheduleATransactionTypes.PAC_CONDUIT_EARMARK,
        memo_code: false,
      },
      ...properties,
    });
  }
}
