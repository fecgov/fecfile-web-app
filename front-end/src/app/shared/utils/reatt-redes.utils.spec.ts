import { FormControl, FormGroup } from '@angular/forms';
import { ReattRedesUtils } from './reatt-redes.utils';
import { testActiveReport, testIndividualReceipt, testScheduleATransaction } from './unit-test.utils';
import { Form3X } from '../models/form-3x.model';
import { SchATransaction } from '../models/scha-transaction.model';

describe('ReattRedesUtils', () => {
  it('should create an instance', () => {
    expect(new ReattRedesUtils()).toBeTruthy();
  });

  it('should update validation rules', () => {
    const form = new FormGroup({
      contribution_date: new FormControl(''),
      contribution_purpose_descrip: new FormControl(''),
    });

    const transaction = { ...testIndividualReceipt } as SchATransaction;
    const parentTransaction = { ...testScheduleATransaction } as SchATransaction;
    parentTransaction.contribution_date = new Date(2022, 6, 27);
    parentTransaction.report = {
      report_code: 'M1',
    } as unknown as Form3X;
    transaction.parent_transaction = parentTransaction;

    const report = testActiveReport;

    transaction.reattribution_redesignation_tag = 'REATTRIBUTED';
    ReattRedesUtils.initValidators(form, transaction, report);
    form.get('contribution_date')?.setValue(new Date() as never);
    expect(form.get('contribution_purpose_descrip')?.value).toBe(
      '(Originally disclosed on M1.) See reattribution below.'
    );

    transaction.reattribution_redesignation_tag = 'REATTRIBUTED';
    ReattRedesUtils.initValidators(form, transaction, report);
    form.get('contribution_date')?.setValue(new Date('2022-06-10') as never);
    expect(form.get('contribution_purpose_descrip')?.value).toBe('See reattribution below.');

    transaction.reattribution_redesignation_tag = 'REDESIGNATED';
    ReattRedesUtils.initValidators(form, transaction, report);
    form.get('contribution_date')?.setValue(new Date() as never);
    expect(form.get('contribution_purpose_descrip')?.value).toBe(
      '(Originally disclosed on M1.) See redesignation below.'
    );

    transaction.reattribution_redesignation_tag = 'REDESIGNATED';
    ReattRedesUtils.initValidators(form, transaction, report);
    form.get('contribution_date')?.setValue(new Date('2022-06-10') as never);
    expect(form.get('contribution_purpose_descrip')?.value).toBe('See redesignation below.');

    transaction.reattribution_redesignation_tag = 'REATTRIBUTION_FROM';
    ReattRedesUtils.initValidators(form, transaction, report);
    expect(form.get('contribution_purpose_descrip')?.value).toBe('Reattribution to org name');

    transaction.reattribution_redesignation_tag = 'REATTRIBUTION_TO';
    (transaction.parent_transaction as SchATransaction).entity_type = 'IND';
    ReattRedesUtils.initValidators(form, transaction, report);
    expect(form.get('contribution_purpose_descrip')?.value).toBe('Reattribution from org name');

    transaction.reattribution_redesignation_tag = 'REDESIGNATION_FROM';
    ReattRedesUtils.initValidators(form, transaction, report);
    expect(form.get('contribution_purpose_descrip')?.value).toBe('Redesignation - Contribution to 2022-07-27');

    transaction.reattribution_redesignation_tag = 'REDESIGNATION_TO';
    transaction.id = undefined;
    ReattRedesUtils.initValidators(form, transaction, report);
    expect(form.get('contribution_purpose_descrip')?.value).toBe('Redesignation - Contribution from 2022-07-27');
  });
});
