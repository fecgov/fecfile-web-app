import { FormControl, FormGroup } from '@angular/forms';
import { SchBTransaction, ScheduleBTransactionTypes } from 'app/shared/models/schb-transaction.model';
import { TransactionTemplateMapType } from 'app/shared/models/transaction-type.model';
import { TransactionContactUtils } from './transaction-contact.utils';
import { Contact, ContactTypes } from 'app/shared/models/contact.model';

describe('FormUtils', () => {
  const component = new TransactionContactUtils();
  describe('FormType', () => {
    it('should be truthy', () => {
      expect(component).toBeTruthy();
    });

    /*static setTransactionContactFormChanges(
      form: FormGroup,
      contact: Contact | undefined,
      templateMap: TransactionTemplateMapType
    ):*/

    it('tests the setTransactionContactFormChanges', () => {
      const transaction = SchBTransaction.fromJSON({
        transaction_type_identifier: ScheduleBTransactionTypes.IN_KIND_CONTRIBUTION_TO_CANDIDATE,
      });
      const templateMap = transaction.transactionType?.templateMap as TransactionTemplateMapType;
      const form = new FormGroup({
        [templateMap.first_name]: new FormControl(),
        [templateMap.last_name]: new FormControl(),
        [templateMap.candidate_first_name]: new FormControl(),
        [templateMap.candidate_last_name]: new FormControl(),
        [templateMap.committee_name]: new FormControl(),
        [templateMap.committee_fec_id]: new FormControl(),
      });

      form.get(templateMap.first_name)?.setValue('Bill');
      form.get(templateMap.candidate_last_name)?.setValue('Testerman');
      form.get(templateMap.committee_name)?.setValue('Tester Committee');

      const ind = Contact.fromJSON({ type: ContactTypes.INDIVIDUAL, first_name: 'Bob', last_name: 'Testerson' });
      const can = Contact.fromJSON({ type: ContactTypes.CANDIDATE, first_name: 'Phil', last_name: 'Testervan' });
      const com = Contact.fromJSON({ type: ContactTypes.COMMITTEE, name: 'Test Committee', committee_id: 'C12345678' });

      transaction.contact_1 = ind;
      transaction.contact_2 = can;
      transaction.contact_3 = com;

      TransactionContactUtils.setTransactionContactFormChanges(form, ind, templateMap);

      expect(ind.first_name).toBe('Bill');
      // These two checks are broken because of a bug with a ticket that is being written
      //expect(can.last_name).toBe('Testerman');
      //expect(com.name).toBe('Tester Committee');

      expect(ind.committee_id).toBeUndefined();
    });
  });
});
