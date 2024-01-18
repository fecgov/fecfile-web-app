import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectReportDialogComponent } from './select-report-dialog.component';
import { ReportService } from "../../../../shared/services/report.service";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { provideMockStore } from "@ngrx/store/testing";
import { testMockStore } from "../../../../shared/utils/unit-test.utils";
import { of } from "rxjs";
import { F3xFormTypes, Form3X } from "../../../../shared/models/form-3x.model";
import { ListRestResponse } from "../../../../shared/models/rest-api.model";

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
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get a list of available reports', async () => {
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
    await component.ngOnInit();
    expect(component.availableReports.length).toBe(1);
  })
});
