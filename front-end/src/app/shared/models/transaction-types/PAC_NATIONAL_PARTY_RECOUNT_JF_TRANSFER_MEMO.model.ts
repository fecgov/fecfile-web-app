import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/PAC_NATIONAL_PARTY_RECOUNT_JF_TRANSFER_MEMO';
import { AggregationGroups } from '../transaction.model';
import { SchATransaction, ScheduleATransactionTypeLabels, ScheduleATransactionTypes } from '../scha-transaction.model';
import { SchATransactionType } from '../scha-transaction-type.model';
import { TransactionNavigationControls, getChildNavigationControls } from '../transaction-navigation-controls.model';
import { COMMITTEE, COMMITTEE_FORM_FIELDS } from 'app/shared/utils/transaction-type-properties';

export class PAC_NATIONAL_PARTY_RECOUNT_JF_TRANSFER_MEMO extends SchATransactionType {
  formFields = COMMITTEE_FORM_FIELDS;
  contactTypeOptions = COMMITTEE;
  title = LabelUtils.get(
    ScheduleATransactionTypeLabels,
    ScheduleATransactionTypes.PAC_NATIONAL_PARTY_RECOUNT_JF_TRANSFER_MEMO
  );
  override shortName = 'PAC';
  schema = schema;
  override navigationControls: TransactionNavigationControls = getChildNavigationControls();

  override generatePurposeDescription(transaction: SchATransaction): string {
    return `Recount/Legal Proceedings Account JF Memo: ${
      (transaction.parent_transaction as SchATransaction).contributor_organization_name
    }`;
  }

  getNewTransaction() {
    return SchATransaction.fromJSON({
      form_type: 'SA17',
      transaction_type_identifier: ScheduleATransactionTypes.PAC_NATIONAL_PARTY_RECOUNT_JF_TRANSFER_MEMO,
      aggregation_group: AggregationGroups.NATIONAL_PARTY_RECOUNT_ACCOUNT,
    });
  }
}
