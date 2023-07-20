import { schema } from 'fecfile-validate/fecfile_validate_js/dist/LOANS_RECEIVED';
import { AggregationGroups } from '../transaction.model';
import { SchATransaction, ScheduleATransactionTypes, ScheduleATransactionTypeLabels } from '../scha-transaction.model';
import { TemplateMapKeyType } from '../transaction-type.model';
import { SchATransactionType } from '../scha-transaction-type.model';
import { LabelUtils } from 'app/shared/utils/label.utils';
import { GROUP_B } from 'app/shared/utils/transaction-type-properties';
import { LOAN_RECEIPT } from 'app/shared/utils/transaction-type-labels.utils';

export class LOAN_RECEIVED_FROM_INDIVIDUAL_RECEIPT extends SchATransactionType {
  override formFieldsConfig = GROUP_B;
  override isDependentChild = true;
  title = LabelUtils.get(
    ScheduleATransactionTypeLabels,
    ScheduleATransactionTypes.LOAN_RECEIVED_FROM_INDIVIDUAL_RECEIPT
  );
  override labelConfig = LOAN_RECEIPT;
  schema = schema;
  override useParentContact = true;
  override inheritedFields = [
    'entity_type',
    'organization_name',
    'first_name',
    'last_name',
    'middle_name',
    'prefix',
    'suffix',
    'street_1',
    'street_2',
    'city',
    'state',
    'zip',
    'date',
    'amount',
    'memo_code',
  ] as TemplateMapKeyType[];

  getNewTransaction() {
    return SchATransaction.fromJSON({
      form_type: 'SA13',
      transaction_type_identifier: ScheduleATransactionTypes.LOAN_RECEIVED_FROM_INDIVIDUAL_RECEIPT,
      aggregation_group: AggregationGroups.GENERAL,
    });
  }

  /////////////////////////////////////////////////////////////////////
  // Template variables to be integrated with #1193
  override doMemoCodeDateCheck = false;
  override alternateTitle = 'Receipt';
}
