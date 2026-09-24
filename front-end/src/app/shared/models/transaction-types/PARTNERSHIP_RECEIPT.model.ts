import { LabelUtils } from 'app/shared/utils/label.utils';
import { ELECTION_FIELDS, ORGANIZATION, ORGANIZATION_FORM_FIELDS } from 'app/shared/utils/transaction-type-properties';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/PARTNERSHIP_RECEIPT';
import { SchATransactionType } from '../scha-transaction-type.model';
import { SchATransaction, ScheduleATransactionTypeLabels, ScheduleATransactionTypes } from '../scha-transaction.model';
import { STANDARD_PARENT_CONTROLS, TransactionNavigationControls } from '../transaction-navigation-controls.model';
import { AggregationGroups } from '../transaction.model';
import { ReportTypes } from '../reports/report.model';

export class PARTNERSHIP_RECEIPT extends SchATransactionType {
  formFields = [...ORGANIZATION_FORM_FIELDS, ...ELECTION_FIELDS];
  contactTypeOptions = ORGANIZATION;
  title = LabelUtils.get(ScheduleATransactionTypeLabels, ScheduleATransactionTypes.PARTNERSHIP_RECEIPT);
  schema = schema;
  override subTransactionConfig = [ScheduleATransactionTypes.PARTNERSHIP_ATTRIBUTION];
  override _navigationControls: TransactionNavigationControls = STANDARD_PARENT_CONTROLS;
  override purposeDescriptionLabelNotice =
    'If Partnership Receipt is saved without a Partnership Memo, this will read "Partnership attributions do not meet itemization threshold". If a Partnership Memo is added, it will read "See Partnership Attribution(s) below".';
  override generatePurposeDescription(transaction: SchATransaction): string {
    if (transaction.children.some((child) => child.itemized === true)) {
      return 'See Partnership Attribution(s) below';
    }
    return 'Partnership attributions do not meet itemization threshold';
  }

  override hasElectionInformation(report_type: ReportTypes): boolean {
    return report_type === ReportTypes.F3;
  }

  override isReattributable(): boolean {
    return false;
  }

  getNewTransaction() {
    return SchATransaction.fromJSON({
      form_type: 'SA11AI',
      transaction_type_identifier: ScheduleATransactionTypes.PARTNERSHIP_RECEIPT,
      aggregation_group: AggregationGroups.GENERAL,
    });
  }
}
