import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { SelectReportDialogComponent } from './select-report-dialog.component';
import { provideMockStore } from '@ngrx/store/testing';
import { testActiveReport, testMockStore, testScheduleATransaction } from '../../../../shared/utils/unit-test.utils';
import { F3xFormTypes, Form3X } from '../../../../shared/models/form-3x.model';
import { ReattRedesTypes, ReattRedesUtils } from '../../../../shared/utils/reatt-redes/reatt-redes.utils';
import { Form3XService } from '../../../../shared/services/form-3x.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { createSignal } from '@angular/core/primitives/signals';

describe('SelectReportDialogComponent', () => {
  let component: SelectReportDialogComponent;
  let fixture: ComponentFixture<SelectReportDialogComponent>;
  let service: Form3XService;
  let futureSpy: jasmine.Spy;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SelectReportDialogComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([]), provideMockStore(testMockStore)],
    });
    service = TestBed.inject(Form3XService);
    fixture = TestBed.createComponent(SelectReportDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    futureSpy = spyOn(service, 'getFutureReports').and.callFake(async () => {
      const data = {
        id: '999',
        form_type: F3xFormTypes.F3XT,
        committee_name: 'foo',
        coverage_through_date: '2024-04-20',
      };
      return [Form3X.fromJSON(data)];
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get a list of available reports', fakeAsync(() => {
    ReattRedesUtils.selectReportDialog.set([testScheduleATransaction, ReattRedesTypes.REATTRIBUTED]);
    tick(500);

    expect(futureSpy).toHaveBeenCalled();
    expect(component.availableReports.length).toBe(1);
  }));

  it('should clear and close on cancel', async () => {
    ReattRedesUtils.selectReportDialog.set([testScheduleATransaction, ReattRedesTypes.REATTRIBUTED]);
    expect(component.transaction).toBeTruthy();

    component.cancel();
    expect(component.transaction).toBeFalsy();
  });

  describe('reattRedes', () => {
    it("should determine if it's a reattribution of redesignation", () => {
      (component.type as any) = createSignal(ReattRedesTypes.REATTRIBUTED);
      expect(component.actionLabel).toBe('reattribute');
      expect(component.urlParameter).toBe('reattribution');
      expect(component.actionTargetLabel).toBe('contributor');

      (component.type as any) = createSignal(ReattRedesTypes.REDESIGNATED);
      expect(component.actionLabel).toBe('redesignate');
      expect(component.urlParameter).toBe('redesignation');
      expect(component.actionTargetLabel).toBe('election');
    });
  });

  describe('createReattribution', () => {
    it('should throw error if no base transaction', async () => {
      (component.transaction as any) = createSignal(undefined);
      try {
        expect(component.transaction).toBeFalsy();
        await component.createReattribution();
      } catch (error) {
        expect(error).toEqual(new Error('No base transaction'));
      }
    });

    it('should redirect based on the selected report and transaction', async () => {
      const routerSpy = spyOn(component.router, 'navigateByUrl');

      ReattRedesUtils.selectReportDialog.set([testScheduleATransaction, ReattRedesTypes.REATTRIBUTED]);
      component.selectedReport.set(component.availableReports()[0]);
      component.selectedReport.set(testActiveReport);
      try {
        await component.createReattribution();
      } finally {
        const route = `/reports/transactions/report/${component.selectedReport()!.id}/create/${testScheduleATransaction.transaction_type_identifier}?reattribution=${testScheduleATransaction.id}`;
        expect(routerSpy).toHaveBeenCalledWith(route);
      }
    });
  });
});
