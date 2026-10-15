import { LabelUtils } from 'app/shared/utils/label.utils';
import { ELECTION_FIELDS, INDIVIDUAL, INDIVIDUAL_B_FORM_FIELDS } from 'app/shared/utils/transaction-type-properties';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/DISBURSEMENT_PARENTS_STAFF';
import { ReportTypes } from '../reports/report.model';
import { SchBTransactionType } from '../schb-transaction-type.model';
import { SchBTransaction, ScheduleBTransactionTypeLabels, ScheduleBTransactionTypes } from '../schb-transaction.model';
import { STANDARD_PARENT_CONTROLS, TransactionNavigationControls } from '../transaction-navigation-controls.model';
import { AggregationGroups } from '../transaction.model';

export class OTHER_DISBURSEMENT_STAFF_REIMBURSEMENT extends SchBTransactionType {
  formFields = [...INDIVIDUAL_B_FORM_FIELDS, ...ELECTION_FIELDS];
  contactTypeOptions = INDIVIDUAL;
  title = LabelUtils.get(
    ScheduleBTransactionTypeLabels,
    ScheduleBTransactionTypes.OTHER_DISBURSEMENT_STAFF_REIMBURSEMENT,
  );
  schema = schema;
  override _navigationControls: TransactionNavigationControls = STANDARD_PARENT_CONTROLS;
  override subTransactionConfig = [ScheduleBTransactionTypes.OTHER_DISBURSEMENT_STAFF_REIMBURSEMENT_MEMO];

  override generatePurposeDescription(transaction: SchBTransaction): string {
    if (transaction.children && transaction.children.some((child) => child.itemized === true)) {
      return 'Reimbursement Memo: See Below';
    }
    return 'Reimbursement memo entries do not meet itemization threshold.';
  }

  override hasElectionInformation(report_type: ReportTypes): boolean {
    return report_type === ReportTypes.F3;
  }

  getNewTransaction() {
    return SchBTransaction.fromJSON({
      transaction_type_identifier: ScheduleBTransactionTypes.OTHER_DISBURSEMENT_STAFF_REIMBURSEMENT,
      aggregation_group: AggregationGroups.GENERAL_DISBURSEMENT,
    });
  }
}
