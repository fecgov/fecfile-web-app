import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/IN_KIND_RECEIPT_FROM_UNREGISTERED_ORGANIZATION';
import { ELECTION_FIELDS, ORGANIZATION, ORGANIZATION_FORM_FIELDS } from 'app/shared/utils/transaction-type-properties';
import { ReportTypes } from '../reports/report.model';
import { SchATransaction, ScheduleATransactionTypeLabels, ScheduleATransactionTypes } from '../scha-transaction.model';
import { STANDARD_DOUBLE_ENTRY_CONTROLS, TransactionNavigationControls } from '../transaction-navigation-controls.model';
import { AggregationGroups } from '../transaction.model';
import { ScheduleBTransactionTypes } from '../schb-transaction.model';
import { IN_KIND } from './common-types/IN_KIND.model';

export class IN_KIND_RECEIPT_FROM_UNREGISTERED_ORGANIZATION extends IN_KIND {
  override formFields = [...ORGANIZATION_FORM_FIELDS, ...ELECTION_FIELDS];
  override contactTypeOptions = ORGANIZATION;
  title = LabelUtils.get(
    ScheduleATransactionTypeLabels,
    ScheduleATransactionTypes.IN_KIND_RECEIPT_FROM_UNREGISTERED_ORGANIZATION,
  );
  schema = schema;
  override dependentChildTransactionTypes = [ScheduleBTransactionTypes.IN_KIND_OUT_FROM_UNREGISTERED_ORGANIZATION];
  override _navigationControls: TransactionNavigationControls = STANDARD_DOUBLE_ENTRY_CONTROLS;

  override get isReattributable(): boolean {
    return false;
  }

  override hasElectionInformation(report_type: ReportTypes): boolean {
    return report_type === ReportTypes.F3;
  }

  getNewTransaction() {
    return SchATransaction.fromJSON({
      transaction_type_identifier: ScheduleATransactionTypes.IN_KIND_RECEIPT_FROM_UNREGISTERED_ORGANIZATION,
      aggregation_group: AggregationGroups.GENERAL,
    });
  }
}
