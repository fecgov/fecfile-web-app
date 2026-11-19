import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/RECOUNT_AND_NP_DISBURSEMENTS';
import { SchBTransactionType } from '../schb-transaction-type.model';
import { SchBTransaction, ScheduleBTransactionTypeLabels, ScheduleBTransactionTypes } from '../schb-transaction.model';

import { AggregationGroups } from '../transaction.model';
import {
  ELECTION_FIELDS,
  INDIVIDUAL_ORGANIZATION_B_FORM_FIELDS,
  ORGANIZATION_INDIVIDUAL_COMMITTEE,
} from 'app/shared/utils/transaction-type-properties';
import { ReportTypes } from '../reports/report.model';

export class RECOUNT_ACCOUNT_DISBURSEMENT extends SchBTransactionType {
  formFields = [...INDIVIDUAL_ORGANIZATION_B_FORM_FIELDS, ...ELECTION_FIELDS];
  override contactTypeOptions = ORGANIZATION_INDIVIDUAL_COMMITTEE;
  title = LabelUtils.get(ScheduleBTransactionTypeLabels, ScheduleBTransactionTypes.RECOUNT_ACCOUNT_DISBURSEMENT);
  schema = schema;

  override purposeDescriptionPrefix = 'Recount Account: ';

  override isCloneableTransactionType = true;

  override hasElectionInformation(report_type: ReportTypes): boolean {
    return report_type === ReportTypes.F3;
  }

  getNewTransaction() {
    return SchBTransaction.fromJSON({
      transaction_type_identifier: ScheduleBTransactionTypes.RECOUNT_ACCOUNT_DISBURSEMENT,
      aggregation_group: AggregationGroups.GENERAL_DISBURSEMENT,
    });
  }
}
