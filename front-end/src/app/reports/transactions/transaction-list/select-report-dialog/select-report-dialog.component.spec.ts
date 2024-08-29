import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { SelectReportDialogComponent } from './select-report-dialog.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { testMockStore, testScheduleATransaction } from '../../../../shared/utils/unit-test.utils';
import { of } from 'rxjs';
import { F3xFormTypes, Form3X } from '../../../../shared/models/form-3x.model';
import { ReattRedesTypes, ReattRedesUtils } from '../../../../shared/utils/reatt-redes/reatt-redes.utils';
import { Form3XService } from '../../../../shared/services/form-3x.service';

describe('SelectReportDialogComponent', () => {
  let component: SelectReportDialogComponent;
  let fixture: ComponentFixture<SelectReportDialogComponent>;
  let service: Form3XService;
  let futureSpy: jasmine.Spy;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [SelectReportDialogComponent],
      providers: [provideMockStore(testMockStore)],
    });
    service = TestBed.inject(Form3XService);
    fixture = TestBed.createComponent(SelectReportDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    futureSpy = spyOn(service, 'getFutureReports').and.callFake(() => {
      const data = {
        id: '999',
        form_type: F3xFormTypes.F3XT,
        committee_name: 'foo',
        coverage_through_date: '2024-04-20',
      };
      return of([Form3X.fromJSON(data)]);
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get a list of available reports', fakeAsync(() => {
    component.ngOnInit();
    ReattRedesUtils.selectReportDialogSubject.next([testScheduleATransaction, ReattRedesTypes.REATTRIBUTED]);
    tick(500);

    expect(futureSpy).toHaveBeenCalled();
    expect(component.availableReports.length).toBe(1);
  }));

  it('should clear and close on cancel', async () => {
    component.ngOnInit();
    ReattRedesUtils.selectReportDialogSubject.next([testScheduleATransaction, ReattRedesTypes.REATTRIBUTED]);
    expect(component.transaction).toBeTruthy();

    component.cancel();
    expect(component.transaction).toBeFalsy();
  });

  describe('reattRedes', () => {
    it("should determine if it's a reattribution of redesignation", () => {
      component.type = ReattRedesTypes.REATTRIBUTED;
      expect(component.reattRedes).toBe('reattribute');

      expect(component.reattRedesignation).toBe('reattribution');
    });
  });

  describe('createReattribution', () => {
    it('should throw error if no base transaction', async () => {
      component.ngOnInit();
      component.transaction = undefined;
      try {
        expect(component.transaction).toBeFalsy();
        await component.createReattribution();
      } catch (error) {
        expect(error).toEqual(new Error('No base transaction'));
      }
    });

    it('should redirect based on the selected report and transaction', async () => {
      const routerSpy = spyOn(component.router, 'navigateByUrl');
      component.ngOnInit();
      ReattRedesUtils.selectReportDialogSubject.next([testScheduleATransaction, ReattRedesTypes.REATTRIBUTED]);
      component.selectedReport = component.availableReports[0];
      try {
        await component.createReattribution();
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        console.log("shouldn't go here");
      }
      const route = `/reports/transactions/report/${component.selectedReport.id}/create/${testScheduleATransaction.transaction_type_identifier}?reattribution=${testScheduleATransaction.id}`;
      expect(routerSpy).toHaveBeenCalledWith(route);
    });
  });
});
