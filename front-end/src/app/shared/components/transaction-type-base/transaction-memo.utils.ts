import { FormGroup } from '@angular/forms';
import { Transaction } from 'app/shared/models/transaction.model';
import { MemoText } from 'app/shared/models/memo-text.model';

export class TransactionMemoUtils {
  // prettier-ignore
  static retrieveMemoText(transaction: Transaction, form: FormGroup, formValues: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
      const text = form.get('memo_text_description')?.value;
      if (text && text.length > 0) {
        const memo_text = MemoText.fromJSON({
          text4000: text,
          report_id: transaction?.report_id,
          rec_type: 'TEXT',
        });
  
        if (transaction?.id) {
          memo_text.transaction_uuid = transaction.id;
        }
  
        formValues['memo_text'] = memo_text;
      } else {
        formValues['memo_text'] = undefined;
      }
  
      return formValues;
    }

  static patchMemoText(transaction: Transaction | undefined, form: FormGroup) {
    const memo_text = transaction?.memo_text;
    if (memo_text?.text4000) {
      form.patchValue({ memo_text_description: memo_text.text4000 });
    }
  }
}
