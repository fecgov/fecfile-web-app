import type { Mock } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelectReportDialogComponent } from './select-report-dialog.component';
import { provideMockStore } from '@ngrx/store/testing';
import { testActiveReport, testMockStore, testScheduleATransaction } from '../../../../shared/utils/unit-test.utils';
import { F3xFormTypes, Form3X } from '../../../../shared/models/reports/form-3x.model';
import { ReattRedesTypes } from '../../../../shared/utils/reatt-redes/reatt-redes.utils';
import { Form3XService } from '../../../../shared/services/form-3x.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { TransactionListRecord } from 'app/shared/models/transaction-list-record.model';
import { FORM_3_SERVICE } from 'app/shared/services/base-form-3.service';
import { ReattRedesStore } from 'app/shared/utils/reatt-redes/reatt-redes.store';

describe('SelectReportDialogComponent', () => {
  let component: SelectReportDialogComponent;
  let fixture: ComponentFixture<SelectReportDialogComponent>;
  let service: Form3XService;
  let futureSpy: Mock;
  let reatRedesStore: ReattRedesStore;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SelectReportDialogComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        provideMockStore(testMockStore()),
        Form3XService,
        { provide: FORM_3_SERVICE, useClass: Form3XService },
        ReattRedesStore,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectReportDialogComponent);
    service = fixture.debugElement.injector.get(Form3XService);
    reatRedesStore = TestBed.inject(ReattRedesStore);
    component = fixture.componentInstance;
    fixture.detectChanges();
    const data = {
      id: '999',
      form_type: F3xFormTypes.F3XT,
      committee_name: 'foo',
      coverage_through_date: '2024-04-20',
    };

    futureSpy = vi.spyOn(service, 'getFutureReports').mockResolvedValue([Form3X.fromJSON(data)]);
    fixture = TestBed.createComponent(SelectReportDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get a list of available reports', async () => {
    const transaction: TransactionListRecord = {
      ...testScheduleATransaction(),
      name: 'TEST',
      date: new Date(),
      amount: 100,
      balance: 0,
      aggregate: 0,
      report_code_label: '',
      can_delete: true,
      force_unaggregated: true,
      report_type: 'Form 3X',
    } as unknown as TransactionListRecord;
    await reatRedesStore.setTransaction(transaction, ReattRedesTypes.REATTRIBUTED);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(reatRedesStore.transaction()).toBeTruthy();
    expect(futureSpy).toHaveBeenCalled();
    expect(reatRedesStore.futureReports()!).toHaveLength(1);
  });

  it('should clear and close on cancel', async () => {
    const transaction: TransactionListRecord = {
      ...testScheduleATransaction(),
      name: 'TEST',
      date: new Date(),
      amount: 100,
      balance: 0,
      aggregate: 0,
      report_code_label: '',
      can_delete: true,
      force_unaggregated: true,
      report_type: 'Form 3X',
    } as unknown as TransactionListRecord;
    await reatRedesStore.setTransaction(transaction, ReattRedesTypes.REATTRIBUTED);
    expect(reatRedesStore.transaction()).toBeTruthy();

    component.cancel();
    fixture.detectChanges();
    expect(reatRedesStore.transaction()).toBeFalsy();
  });

  describe('reattRedes', () => {
    it("should determine if it's a reattribution of redesignation", async () => {
      const transaction: TransactionListRecord = {
        ...testScheduleATransaction(),
        name: 'TEST',
        date: new Date(),
        amount: 100,
        balance: 0,
        aggregate: 0,
        report_code_label: '',
        can_delete: true,
        force_unaggregated: true,
        report_type: 'Form 3X',
      } as unknown as TransactionListRecord;
      await reatRedesStore.setTransaction(transaction, ReattRedesTypes.REATTRIBUTED);
      expect(reatRedesStore.actionLabel()).toBe('reattribute');
      expect(reatRedesStore.nounLabel()).toBe('reattribution');
      expect(reatRedesStore.actionTargetLabel()).toBe('contributor');

      await reatRedesStore.setTransaction(transaction, ReattRedesTypes.REDESIGNATED);
      expect(reatRedesStore.actionLabel()).toBe('redesignate');
      expect(reatRedesStore.nounLabel()).toBe('redesignation');
      expect(reatRedesStore.actionTargetLabel()).toBe('election');
    });
  });

  describe('createReattribution', () => {
    it('should throw error if no base transaction', async () => {
      reatRedesStore.clearTransaction();
      fixture.detectChanges();
      try {
        expect(reatRedesStore.transaction()).toBeFalsy();
        await component.createReattribution();
      } catch (error) {
        expect(error).toEqual(new Error('No base transaction'));
      }
    });

    it('should redirect based on the selected report and transaction', async () => {
      const routerSpy = vi.spyOn(component.router, 'navigateByUrl').mockResolvedValue(true);
      const transaction: TransactionListRecord = {
        ...testScheduleATransaction(),
        name: 'TEST',
        date: new Date(),
        amount: 100,
        balance: 0,
        aggregate: 0,
        report_code_label: '',
        can_delete: true,
        force_unaggregated: true,
        report_type: 'Form 3X',
      } as unknown as TransactionListRecord;
      await reatRedesStore.setTransaction(transaction, ReattRedesTypes.REATTRIBUTED);
      fixture.detectChanges();
      await fixture.whenStable();
      component.selectedReport = reatRedesStore.futureReports()![0];
      component.selectedReport = testActiveReport();
      try {
        await component.createReattribution();
      } finally {
        const route = `/reports/transactions/report/${component.selectedReport.id}/create/${transaction.transaction_type_identifier}?reattribution=${transaction.id}`;
        expect(routerSpy).toHaveBeenCalledWith(route);
      }
    });
  });
});
