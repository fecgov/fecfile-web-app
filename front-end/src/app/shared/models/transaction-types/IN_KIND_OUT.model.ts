import { schema } from 'fecfile-validate/fecfile_validate_js/dist/IN_KIND_OUT';
import { TemplateMapKeyType } from '../transaction-type.model';
import { LabelUtils } from 'app/shared/utils/label.utils';
import { INDIVIDUAL_B_FORM_FIELDS } from 'app/shared/utils/transaction-type-properties';
import { ABSTRACT_IN_KIND_OUT as CommonInKindOut } from './ABSTRACT_IN_KIND_OUT.model';
import { ScheduleBTransactionTypeLabels, ScheduleBTransactionTypes, AggregationGroups } from '../type-enums';
export class IN_KIND_OUT extends CommonInKindOut {
  override formFields = INDIVIDUAL_B_FORM_FIELDS;
  title = LabelUtils.get(ScheduleBTransactionTypeLabels, ScheduleBTransactionTypes.IN_KIND_OUT);
  schema = schema;
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

  override readonly initializationData = {
    form_type: 'SB21B',
    transaction_type_identifier: ScheduleBTransactionTypes.IN_KIND_OUT,
    aggregation_group: AggregationGroups.GENERAL_DISBURSEMENT,
  };
}
