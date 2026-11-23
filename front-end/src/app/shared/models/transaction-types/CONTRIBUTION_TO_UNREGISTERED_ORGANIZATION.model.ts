import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/CONTRIBUTION_TO_UNREGISTERED_ORGANIZATION';
import { SchBTransactionType } from '../schb-transaction-type.model';
import { SchBTransaction, ScheduleBTransactionTypeLabels, ScheduleBTransactionTypes } from '../schb-transaction.model';
import {
  ELECTION_FIELDS,
  ORGANIZATION,
  ORGANIZATION_B_FORM_FIELDS,
} from 'app/shared/utils/transaction-type-properties';
import { AggregationGroups } from '../transaction.model';

export class CONTRIBUTION_TO_UNREGISTERED_ORGANIZATION extends SchBTransactionType {
  formFields = [...ORGANIZATION_B_FORM_FIELDS, ...ELECTION_FIELDS];
  contactTypeOptions = ORGANIZATION;
  title = LabelUtils.get(
    ScheduleBTransactionTypeLabels,
    ScheduleBTransactionTypes.CONTRIBUTION_TO_UNREGISTERED_ORGANIZATION,
  );
  schema = schema;

  override isCloneableTransactionType = true;
  override showAggregate = true;

  getNewTransaction() {
    return SchBTransaction.fromJSON({
      transaction_type_identifier: ScheduleBTransactionTypes.CONTRIBUTION_TO_UNREGISTERED_ORGANIZATION,
      aggregation_group: AggregationGroups.GENERAL_DISBURSEMENT,
    });
  }
}
