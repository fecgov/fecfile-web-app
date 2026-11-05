import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/DISBURSEMENT_MEMOS';
import { SchBTransaction, ScheduleBTransactionTypeLabels, ScheduleBTransactionTypes } from '../schb-transaction.model';
import { CHILD_CONTROLS } from '../transaction-navigation-controls.model';
import { AggregationGroups } from '../transaction.model';
import {
  ELECTION_FIELDS,
  INDIVIDUAL_ORGANIZATION_B_FORM_FIELDS,
  INDIVIDUAL_ORGANIZATION_COMMITTEE,
} from 'app/shared/utils/transaction-type-properties';
import { SCHEDULE_B_MEMO } from './common-types/SCHEDULE_B_MEMO.model';
import { ReportTypes } from '../reports/report.model';

export class OTHER_DISBURSEMENT_PAYMENT_TO_PAYROLL_MEMO extends SCHEDULE_B_MEMO {
  formFields = [...INDIVIDUAL_ORGANIZATION_B_FORM_FIELDS, ...ELECTION_FIELDS];
  override contactTypeOptions = INDIVIDUAL_ORGANIZATION_COMMITTEE;
  title = LabelUtils.get(
    ScheduleBTransactionTypeLabels,
    ScheduleBTransactionTypes.OTHER_DISBURSEMENT_PAYMENT_TO_PAYROLL_MEMO,
  );
  schema = schema;
  override _navigationControls = CHILD_CONTROLS;

  getNewTransaction() {
    return SchBTransaction.fromJSON({
      transaction_type_identifier: ScheduleBTransactionTypes.OTHER_DISBURSEMENT_PAYMENT_TO_PAYROLL_MEMO,
      aggregation_group: AggregationGroups.GENERAL_DISBURSEMENT,
    });
  }

  override hasElectionInformation(report_type: ReportTypes): boolean {
    return report_type === ReportTypes.F3;
  }
}
