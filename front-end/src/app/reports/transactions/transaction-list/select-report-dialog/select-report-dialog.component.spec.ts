import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectReportDialogComponent } from './select-report-dialog.component';
import { ReportService } from "../../../../shared/services/report.service";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { provideMockStore } from "@ngrx/store/testing";
import { testMockStore, testScheduleATransaction } from "../../../../shared/utils/unit-test.utils";
import { of } from "rxjs";
import { F3xFormTypes, Form3X } from "../../../../shared/models/form-3x.model";
import { ListRestResponse } from "../../../../shared/models/rest-api.model";
import { ReattRedesUtils } from "../../../../shared/utils/reatt-redes/reatt-redes.utils";

describe('SelectReportDialogComponent', () => {
  let component: SelectReportDialogComponent;
  let fixture: ComponentFixture<SelectReportDialogComponent>;
  let reportService: ReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]),],
      declarations: [SelectReportDialogComponent],
      providers: [provideMockStore(testMockStore)]
    });
    reportService = TestBed.inject(ReportService);
    fixture = TestBed.createComponent(SelectReportDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    spyOn(reportService, 'getTableData').and.callFake(() => {
      const data = {
        id: '999',
        form_type: F3xFormTypes.F3XT,
        committee_name: 'foo',
      };
      const response: ListRestResponse = {
        next: "",
        pageNumber: 0,
        previous: "",
        results: [Form3X.fromJSON(data)],
        count: 1
      };
      return of(response);
    })
    spyOn(reportService, 'isEditable').and.callThrough();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get a list of available reports', async () => {
    await component.ngOnInit();
    expect(component.availableReports.length).toBe(1);
  })

  it('should clear and close on cancel', async () => {
    await component.ngOnInit();
    ReattRedesUtils.selectReportDialogSubject.next(testScheduleATransaction);
    expect(component.transaction).toBeTruthy();

    component.cancel();
    expect(component.transaction).toBeFalsy();
  });

  describe('createReattribution', () => {
    it('should throw error if no base transaction', async () => {
      await component.ngOnInit();
      component.transaction = undefined;
      try {
        await component.createReattribution();
      } catch (error) {
        expect(error).toEqual(new Error("No base transaction"))
      }
    });

    it('should redirect based on the selected report and transaction', async () => {
      const routerSpy = spyOn(component.router, 'navigateByUrl');
      await component.ngOnInit();
      ReattRedesUtils.selectReportDialogSubject.next(testScheduleATransaction);
      component.selectedReport = component.availableReports[0];
      try {
        await component.createReattribution();
      } catch (error) {
        console.log("shouldn't go here");
      }
      const route = `/reports/transactions/report/${component.selectedReport.id}/create/${testScheduleATransaction.transaction_type_identifier}?reattribution=${testScheduleATransaction.id}`
      expect(routerSpy).toHaveBeenCalledWith(route);
    });
  });
});

