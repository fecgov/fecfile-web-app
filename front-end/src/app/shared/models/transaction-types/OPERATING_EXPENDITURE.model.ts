import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/DISBURSEMENTS';
import { SchBTransactionType } from '../schb-transaction-type.model';
import { SchBTransaction, ScheduleBTransactionTypeLabels, ScheduleBTransactionTypes } from '../schb-transaction.model';

import { AggregationGroups } from '../transaction.model';
import {
  ELECTION_FIELDS,
  INDIVIDUAL_ORGANIZATION_B_FORM_FIELDS,
  ORGANIZATION_INDIVIDUAL_COMMITTEE,
} from 'app/shared/utils/transaction-type-properties';
import { ReportTypes } from '../reports/report.model';

export class OPERATING_EXPENDITURE extends SchBTransactionType {
  formFields = [...INDIVIDUAL_ORGANIZATION_B_FORM_FIELDS, ...ELECTION_FIELDS];
  override contactTypeOptions = ORGANIZATION_INDIVIDUAL_COMMITTEE;
  title = LabelUtils.get(ScheduleBTransactionTypeLabels, ScheduleBTransactionTypes.OPERATING_EXPENDITURE);
  schema = schema;

  override isCloneableTransactionType = true;

  override hasElectionInformation(report_type: ReportTypes): boolean {
    return report_type === ReportTypes.F3;
  }

  getNewTransaction() {
    return SchBTransaction.fromJSON({
      transaction_type_identifier: ScheduleBTransactionTypes.OPERATING_EXPENDITURE,
      aggregation_group: AggregationGroups.GENERAL_DISBURSEMENT,
    });
  }
}
