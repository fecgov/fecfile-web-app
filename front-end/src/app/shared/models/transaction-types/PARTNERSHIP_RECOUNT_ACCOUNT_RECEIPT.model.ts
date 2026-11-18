import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/PARTNERSHIP_RECOUNT_ACCOUNT_RECEIPT';
import { SchATransaction, ScheduleATransactionTypeLabels, ScheduleATransactionTypes } from '../scha-transaction.model';
import { STANDARD_PARENT_CONTROLS, TransactionNavigationControls } from '../transaction-navigation-controls.model';
import { AggregationGroups } from '../transaction.model';
import { SchATransactionType } from '../scha-transaction-type.model';
import { ORGANIZATION_FORM_FIELDS, ORGANIZATION, ELECTION_FIELDS } from 'app/shared/utils/transaction-type-properties';
import { ReportTypes } from '../reports/report.model';

export class PARTNERSHIP_RECOUNT_ACCOUNT_RECEIPT extends SchATransactionType {
  formFields = [...ORGANIZATION_FORM_FIELDS, ...ELECTION_FIELDS];
  contactTypeOptions = ORGANIZATION;
  title = LabelUtils.get(ScheduleATransactionTypeLabels, ScheduleATransactionTypes.PARTNERSHIP_RECOUNT_ACCOUNT_RECEIPT);
  schema = schema;
  override subTransactionConfig = [ScheduleATransactionTypes.PARTNERSHIP_ATTRIBUTION_RECOUNT_ACCOUNT_RECEIPT_MEMO];
  override _navigationControls: TransactionNavigationControls = STANDARD_PARENT_CONTROLS;
  override purposeDescriptionLabelNotice =
    'If Partnership Receipt is saved without a Partnership Memo, this will read "Recount Account (Partnership attributions do not meet itemization threshold)". If a Partnership Memo is added, it will read "Recount Account (See Partnership Attribution(s) below)".';
  override generatePurposeDescription(transaction: SchATransaction): string {
    if (transaction.children.some((child) => child.itemized === true)) {
      return 'Recount Account (See Partnership Attribution(s) below)';
    }
    return 'Recount Account (Partnership attributions do not meet itemization threshold)';
  }

  override get isReattributable(): boolean {
    return false;
  }

  override hasElectionInformation(reportType: ReportTypes): boolean {
    return reportType === ReportTypes.F3;
  }

  getNewTransaction() {
    return SchATransaction.fromJSON({
      transaction_type_identifier: ScheduleATransactionTypes.PARTNERSHIP_RECOUNT_ACCOUNT_RECEIPT,
      aggregation_group: AggregationGroups.RECOUNT_ACCOUNT,
    });
  }
}
