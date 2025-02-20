import { SchATransaction, ScheduleATransactionTypes } from '../../models/scha-transaction.model';
import { ReattRedesTypes, ReattRedesUtils } from '../../utils/reatt-redes/reatt-redes.utils';
import { SchBTransaction, ScheduleBTransactionTypes } from '../../models/schb-transaction.model';
import {
  NavigationAction,
  NavigationDestination,
  NavigationEvent,
} from '../../models/transaction-navigation-controls.model';
import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { Confirmation, ConfirmationService, MessageService } from 'primeng/api';
import { TransactionService } from '../../services/transaction.service';
import { ReportService } from '../../services/report.service';
import { DatePipe } from '@angular/common';
import { FormBuilder } from '@angular/forms';
import { provideMockStore } from '@ngrx/store/testing';
import { getTestTransactionByType, testActiveReport, testMockStore } from '../../utils/unit-test.utils';
import { FecDatePipe } from '../../pipes/fec-date.pipe';
import { RedesignationToUtils } from '../../utils/reatt-redes/redesignation-to.utils';
import { RedesignationFromUtils } from '../../utils/reatt-redes/redesignation-from.utils';
import { ReattRedesTransactionTypeDetailComponent } from '../../../reports/transactions/reatt-redes-transaction-type-detail/reatt-redes-transaction-type-detail.component';
import { ReattributedUtils } from '../../utils/reatt-redes/reattributed.utils';
import { provideRouter } from '@angular/router';
import { SubscriptionFormControl } from 'app/shared/utils/subscription-form-control';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

describe('ReattTransactionTypeBaseComponent', () => {
  let component: ReattRedesTransactionTypeDetailComponent;
  let fixture: ComponentFixture<ReattRedesTransactionTypeDetailComponent>;
  let testTransaction: SchATransaction;
  let testConfirmationService: ConfirmationService;
  let transactionService: TransactionService;
  let reportService: ReportService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReattRedesTransactionTypeDetailComponent],
      providers: [
        provideMockStore(testMockStore),
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        provideAnimationsAsync(),
        DatePipe,
        MessageService,
        FormBuilder,
        TransactionService,
        ConfirmationService,
        provideMockStore(testMockStore),
        FecDatePipe,
        ReportService,
        TransactionService,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    testTransaction = getTestTransactionByType(ScheduleATransactionTypes.PAC_EARMARK_RECEIPT) as SchATransaction;
    testTransaction.reports = [testActiveReport];
    testTransaction.report_ids = ['999'];
    testTransaction.children = [
      getTestTransactionByType(ScheduleATransactionTypes.PAC_EARMARK_MEMO) as SchATransaction,
    ];

    reportService = TestBed.inject(ReportService);
    spyOn(reportService, 'isEditable').and.returnValue(true);
    testConfirmationService = TestBed.inject(ConfirmationService);
    spyOn(testConfirmationService, 'confirm').and.callFake((confirmation: Confirmation) => {
      if (confirmation.accept) return confirmation?.accept();
    });
    transactionService = TestBed.inject(TransactionService);

    fixture = TestBed.createComponent(ReattRedesTransactionTypeDetailComponent);
    component = fixture.componentInstance;
    component.transaction = testTransaction;
    component.childTransaction = testTransaction;
    let reattRedes = getTestTransactionByType(ScheduleATransactionTypes.PAC_EARMARK_RECEIPT) as SchATransaction;
    reattRedes.reports = [testActiveReport];
    reattRedes = ReattributedUtils.overlayTransactionProperties(reattRedes);
    component.transaction.reatt_redes = reattRedes;
    component.ngOnInit();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('reattribution and redesignation', () => {
    it('should update child primary contacts', () => {
      if (!component.transaction) throw Error('Bad test setup');
      const overlaySpy = spyOn(ReattRedesUtils, 'overlayForms').and.callThrough();
      const childFormSpy = spyOn(component, 'childUpdateFormWithPrimaryContact');
      const primaryContactSpy = spyOn(component, 'updateFormWithPrimaryContact');
      const updateElectionDataSpy = spyOn(component, 'updateElectionData');

      (component.transaction as SchBTransaction).reattribution_redesignation_tag = ReattRedesTypes.REDESIGNATION_TO;
      component.ngOnInit();
      expect(overlaySpy).toHaveBeenCalledTimes(1);
      expect(childFormSpy).toHaveBeenCalledTimes(1);
      expect(primaryContactSpy).toHaveBeenCalledTimes(1);
      expect(updateElectionDataSpy).toHaveBeenCalledTimes(1);
    });

    it('should save all transaction', fakeAsync(async () => {
      if (!component.transaction) throw Error('Bad test setup');
      spyOn(ReattRedesUtils, 'isReattRedes').and.callFake(() => true);
      const multiSaveSpy = spyOn(transactionService, 'multiSaveReattRedes').and.callFake(() =>
        Promise.resolve([testTransaction]),
      );
      const navSpy = spyOn(component, 'navigateTo').and.callFake(async () => true);
      component.ngOnInit();
      await component.save(
        new NavigationEvent(NavigationAction.SAVE, NavigationDestination.LIST, component.transaction),
      );

      expect(multiSaveSpy).toHaveBeenCalledTimes(1);
      expect(navSpy).toHaveBeenCalledTimes(1);
    }));
  });

  describe('updateElectionData', () => {
    it("should bail if no templatemap or it's not schedule B", () => {
      component.childTransaction = undefined;
      component.updateElectionData();
      expect(component.childForm.get('election_code')).toBeFalsy();
    });

    it('should update election and candidate data for primary and child forms', () => {
      const data = {
        id: '999',
        form_type: 'SA11Ai',
        payee_organization_name: 'foo',
        expenditure_date: undefined,
        fields_to_validate: ['abc', 'expenditure_purpose_descrip'],
        report_ids: ['1'],
        transaction_type_identifier: ScheduleBTransactionTypes.CONTRIBUTION_TO_CANDIDATE,
        election_code: 'A',
        election_other_description: 'A',
        beneficiary_candidate_fec_id: 'A',
        beneficiary_candidate_last_name: 'A',
        beneficiary_candidate_first_name: 'A',
        beneficiary_candidate_office: 'A',
        beneficiary_candidate_state: 'A',
        beneficiary_candidate_district: 'A',
        category_code: 'A',
      };
      component.transaction = RedesignationToUtils.overlayTransactionProperties(SchBTransaction.fromJSON(data));
      expect(component.transaction.transactionType.templateMap).toBeTruthy();
      component.childTransaction = RedesignationFromUtils.overlayTransactionProperties(SchBTransaction.fromJSON(data));
      component.childTransaction.reatt_redes = SchBTransaction.fromJSON(data);
      component.childForm.addControl('election_code', new SubscriptionFormControl(''));
      component.childForm.addControl('election_other_description', new SubscriptionFormControl(''));
      component.childForm.addControl('category_code', new SubscriptionFormControl(''));
      component.childForm.addControl('beneficiary_candidate_fec_id', new SubscriptionFormControl(''));
      component.childForm.addControl('beneficiary_candidate_last_name', new SubscriptionFormControl(''));
      component.childForm.addControl('beneficiary_candidate_first_name', new SubscriptionFormControl(''));
      component.childForm.addControl('beneficiary_candidate_office', new SubscriptionFormControl(''));
      component.childForm.addControl('beneficiary_candidate_state', new SubscriptionFormControl(''));
      component.childForm.addControl('beneficiary_candidate_district', new SubscriptionFormControl(''));

      component.form.addControl('category_code', new SubscriptionFormControl(''));
      component.form.addControl('beneficiary_candidate_fec_id', new SubscriptionFormControl(''));
      component.form.addControl('beneficiary_candidate_last_name', new SubscriptionFormControl(''));
      component.form.addControl('beneficiary_candidate_first_name', new SubscriptionFormControl(''));
      component.form.addControl('beneficiary_candidate_office', new SubscriptionFormControl(''));
      component.form.addControl('beneficiary_candidate_state', new SubscriptionFormControl(''));
      component.form.addControl('beneficiary_candidate_district', new SubscriptionFormControl(''));

      expect(Object.keys(component.childForm.controls)).toContain('election_code');

      component.updateElectionData();
      expect(component.childForm.get('election_code')?.value).toBe('A');
      expect(component.childForm.get('election_other_description')?.value).toBe('A');
      expect(component.childForm.get('category_code')?.value).toBe('A');
      expect(component.childForm.get('beneficiary_candidate_fec_id')?.value).toBe('A');
      expect(component.childForm.get('beneficiary_candidate_last_name')?.value).toBe('A');
      expect(component.childForm.get('beneficiary_candidate_first_name')?.value).toBe('A');
      expect(component.childForm.get('beneficiary_candidate_office')?.value).toBe('A');
      expect(component.childForm.get('beneficiary_candidate_state')?.value).toBe('A');
      expect(component.childForm.get('beneficiary_candidate_district')?.value).toBe('A');

      expect(component.form.get('category_code')?.value).toBe('A');
      expect(component.form.get('beneficiary_candidate_fec_id')?.value).toBe('A');
      expect(component.form.get('beneficiary_candidate_last_name')?.value).toBe('A');
      expect(component.form.get('beneficiary_candidate_first_name')?.value).toBe('A');
      expect(component.form.get('beneficiary_candidate_office')?.value).toBe('A');
      expect(component.form.get('beneficiary_candidate_state')?.value).toBe('A');
      expect(component.form.get('beneficiary_candidate_district')?.value).toBe('A');
    });
  });
});
