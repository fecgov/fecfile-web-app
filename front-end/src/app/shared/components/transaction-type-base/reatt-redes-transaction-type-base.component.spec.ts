import { SchATransaction, ScheduleATransactionTypes } from '../../models/scha-transaction.model';
import { ReattRedesTypes, ReattRedesUtils } from '../../utils/reatt-redes/reatt-redes.utils';
import { SchBTransaction, ScheduleBTransactionTypes } from '../../models/schb-transaction.model';
import { of } from 'rxjs';
import {
  NavigationAction,
  NavigationDestination,
  NavigationEvent,
} from '../../models/transaction-navigation-controls.model';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Confirmation, ConfirmationService, MessageService } from 'primeng/api';
import { TransactionService } from '../../services/transaction.service';
import { ReportService } from '../../services/report.service';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormControl } from '@angular/forms';
import { provideMockStore } from '@ngrx/store/testing';
import { getTestTransactionByType, testMockStore } from '../../utils/unit-test.utils';
import { FecDatePipe } from '../../pipes/fec-date.pipe';
import { RedesignationToUtils } from '../../utils/reatt-redes/redesignation-to.utils';
import { RedesignationFromUtils } from '../../utils/reatt-redes/redesignation-from.utils';
import { ReattRedesTransactionTypeDetailComponent } from '../../../reports/transactions/reatt-redes-transaction-type-detail/reatt-redes-transaction-type-detail.component';

describe('ReattTransactionTypeBaseComponent', () => {
  let component: ReattRedesTransactionTypeDetailComponent;
  let fixture: ComponentFixture<ReattRedesTransactionTypeDetailComponent>;
  let testTransaction: SchATransaction;
  let testConfirmationService: ConfirmationService;
  let transactionService: TransactionService;
  let reportService: ReportService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReattRedesTransactionTypeDetailComponent],
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [
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
    testTransaction.report_id = '123';
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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('reattribution and redesignation', () => {
    beforeEach(() => {
      testTransaction.reatt_redes = {
        id: '999',
        report_id: '999',
        contribution_amount: 100,
      } as unknown as SchATransaction;
    });
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

    it('should save all transaction', () => {
      if (!component.transaction) throw Error('Bad test setup');
      component.originating.transaction = component.transaction;
      spyOn(ReattRedesUtils, 'isReattRedes').and.callFake(() => true);
      const multiSaveSpy = spyOn(transactionService, 'multiSaveReattRedes').and.callFake(() => of([testTransaction]));
      const navSpy = spyOn(component, 'navigateTo').and.callFake(() => {
        return;
      });
      component.ngOnInit();
      component.save(new NavigationEvent(NavigationAction.SAVE, NavigationDestination.LIST, component.transaction));

      expect(multiSaveSpy).toHaveBeenCalledTimes(1);
      expect(navSpy).toHaveBeenCalledTimes(1);
    });
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
        report_id: '1',
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
      component.childForm.addControl('election_code', new FormControl(''));
      component.childForm.addControl('election_other_description', new FormControl(''));
      component.childForm.addControl('category_code', new FormControl(''));
      component.childForm.addControl('beneficiary_candidate_fec_id', new FormControl(''));
      component.childForm.addControl('beneficiary_candidate_last_name', new FormControl(''));
      component.childForm.addControl('beneficiary_candidate_first_name', new FormControl(''));
      component.childForm.addControl('beneficiary_candidate_office', new FormControl(''));
      component.childForm.addControl('beneficiary_candidate_state', new FormControl(''));
      component.childForm.addControl('beneficiary_candidate_district', new FormControl(''));

      component.form.addControl('category_code', new FormControl(''));
      component.form.addControl('beneficiary_candidate_fec_id', new FormControl(''));
      component.form.addControl('beneficiary_candidate_last_name', new FormControl(''));
      component.form.addControl('beneficiary_candidate_first_name', new FormControl(''));
      component.form.addControl('beneficiary_candidate_office', new FormControl(''));
      component.form.addControl('beneficiary_candidate_state', new FormControl(''));
      component.form.addControl('beneficiary_candidate_district', new FormControl(''));

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
