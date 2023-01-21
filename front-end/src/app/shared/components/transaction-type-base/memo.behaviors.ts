import { FormGroup } from '@angular/forms';
import { TransactionType } from 'app/shared/models/transaction-types/transaction-type.model';
import { MemoText } from 'app/shared/models/memo-text.model';

export class MemoBehaviors {
  // prettier-ignore
  static retrieveMemoText(transactionType: TransactionType, form: FormGroup, formValues: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
      const text = form.get('memo_text_input')?.value;
      if (text && text.length > 0) {
        const memo_text = MemoText.fromJSON({
          text4000: text,
          report_id: transactionType?.transaction?.report_id,
          rec_type: 'TEXT',
          filer_committee_id_number: transactionType?.transaction?.filer_committee_id_number,
          transaction_id_number: '',
          back_reference_sched_form_name: transactionType?.transaction?.form_type,
        });
  
        if (transactionType.transaction?.id) {
          memo_text.transaction_uuid = transactionType.transaction.id;
        }
  
        formValues['memo_text'] = memo_text;
      } else {
        formValues['memo_text'] = undefined;
      }
  
      return formValues;
    }

  static patchMemoText(transactionType: TransactionType | undefined, form: FormGroup) {
    const memo_text = transactionType?.transaction?.memo_text;
    if (memo_text?.text4000) {
      form.patchValue({ memo_text_input: memo_text.text4000 });
    }
  }
}
