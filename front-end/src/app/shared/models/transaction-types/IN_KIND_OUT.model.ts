import { schema } from 'fecfile-validate/fecfile_validate_js/dist/IN_KIND_OUT';
import { AggregationGroups } from '../transaction.model';
import { SchBTransaction, ScheduleBTransactionTypes, ScheduleBTransactionTypeLabels } from '../schb-transaction.model';
import { TemplateMapKeyType } from '../transaction-type.model';
import { LabelUtils } from 'app/shared/utils/label.utils';
import { INDIVIDUAL_B_FORM_FIELDS } from 'app/shared/utils/transaction-type-properties';
import { IN_KIND_OUT as CommonInKindOut } from './common-types/IN_KIND_OUT.model';
export class IN_KIND_OUT extends CommonInKindOut {
  override formFields = INDIVIDUAL_B_FORM_FIELDS;
  title = LabelUtils.get(ScheduleBTransactionTypeLabels, ScheduleBTransactionTypes.IN_KIND_OUT);
  schema = schema;
  override showAggregate = true;
  override inheritedFields = [
    'last_name',
    'first_name',
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
    'purpose_description',
    'memo_code',
  ] as TemplateMapKeyType[];

  getNewTransaction() {
    return SchBTransaction.fromJSON({
      form_type: 'SB21B',
      transaction_type_identifier: ScheduleBTransactionTypes.IN_KIND_OUT,
      aggregation_group: AggregationGroups.GENERAL_DISBURSEMENT,
    });
  }
}
