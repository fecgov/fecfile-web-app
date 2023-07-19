import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/PAC_EARMARK_RECEIPT';
import { ContactTypes } from '../contact.model';
import { SchATransactionType } from '../scha-transaction-type.model';
import { SchATransaction, ScheduleATransactionTypeLabels, ScheduleATransactionTypes } from '../scha-transaction.model';
import {
  STANDARD_DOUBLE_ENTRY_CONTROLS,
  TransactionNavigationControls,
} from '../transaction-navigation-controls.model';
import { AggregationGroups } from '../transaction.model';
import { TemplateMapKeyType } from '../transaction-type.model';
import { GROUP_EFI } from 'app/shared/utils/transaction-type-properties';
import { EARMARK } from 'app/shared/utils/transaction-type-labels.utils';

export class PAC_EARMARK_RECEIPT extends SchATransactionType {
  formFieldsConfig = GROUP_EFI;
  override labelConfig = EARMARK;
  title = LabelUtils.get(ScheduleATransactionTypeLabels, ScheduleATransactionTypes.PAC_EARMARK_RECEIPT);
  schema = schema;
  override dependentChildTransactionType = ScheduleATransactionTypes.PAC_EARMARK_MEMO;
  override navigationControls: TransactionNavigationControls = STANDARD_DOUBLE_ENTRY_CONTROLS;
  override childTriggerFields = ['organization_name', 'last_name', 'first_name'] as TemplateMapKeyType[];

  override generatePurposeDescription(transaction: SchATransaction): string {
    if (!transaction.children) return '';
    const earmarkMemo: SchATransaction = transaction.children[0] as SchATransaction;
    let conduit = earmarkMemo.contributor_organization_name || '';
    if (
      earmarkMemo.entity_type === ContactTypes.INDIVIDUAL &&
      earmarkMemo.contributor_first_name &&
      earmarkMemo.contributor_last_name
    ) {
      conduit = `${earmarkMemo.contributor_first_name || ''} ${earmarkMemo.contributor_last_name || ''}`;
    }
    if (conduit) {
      return `Earmarked through ${conduit}`;
    }
    return '';
  }

  getNewTransaction() {
    return SchATransaction.fromJSON({
      form_type: 'SA11C',
      transaction_type_identifier: ScheduleATransactionTypes.PAC_EARMARK_RECEIPT,
      aggregation_group: AggregationGroups.GENERAL,
    });
  }
}
