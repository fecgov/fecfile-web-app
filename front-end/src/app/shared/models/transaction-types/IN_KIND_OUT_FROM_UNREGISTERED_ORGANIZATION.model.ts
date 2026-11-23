import { schema } from 'fecfile-validate/fecfile_validate_js/dist/IN_KIND_OUT_FROM_UNREGISTERED_ORGANIZATION';
import { LabelUtils } from 'app/shared/utils/label.utils';
import { ELECTION_FIELDS, ORGANIZATION, ORGANIZATION_B_FORM_FIELDS } from 'app/shared/utils/transaction-type-properties';
import { ReportTypes } from '../reports/report.model';
import { AggregationGroups } from '../transaction.model';
import { SchBTransaction, ScheduleBTransactionTypeLabels, ScheduleBTransactionTypes } from '../schb-transaction.model';
import { TemplateMapKeyType } from '../transaction-type.model';
import { IN_KIND_OUT as CommonInKindOut } from './common-types/IN_KIND_OUT.model';

export class IN_KIND_OUT_FROM_UNREGISTERED_ORGANIZATION extends CommonInKindOut {
  override formFields = [...ORGANIZATION_B_FORM_FIELDS, ...ELECTION_FIELDS];
  override contactTypeOptions = ORGANIZATION;
  title = LabelUtils.get(
    ScheduleBTransactionTypeLabels,
    ScheduleBTransactionTypes.IN_KIND_OUT_FROM_UNREGISTERED_ORGANIZATION,
  );
  schema = schema;
  override inheritedFields = [
    'organization_name',
    'street_1',
    'street_2',
    'city',
    'state',
    'zip',
    'date',
    'amount',
    'purpose_description',
    'memo_code',
    'election_code',
    'election_other_description',
  ] as TemplateMapKeyType[];

  override hasElectionInformation(report_type: ReportTypes): boolean {
    return report_type === ReportTypes.F3;
  }

  getNewTransaction() {
    return SchBTransaction.fromJSON({
      transaction_type_identifier: ScheduleBTransactionTypes.IN_KIND_OUT_FROM_UNREGISTERED_ORGANIZATION,
      aggregation_group: AggregationGroups.GENERAL_DISBURSEMENT,
    });
  }
}
