import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectReportDialogComponent } from './select-report-dialog.component';
import { ReportService } from "../../../../shared/services/report.service";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { provideMockStore } from "@ngrx/store/testing";
import { testMockStore } from "../../../../shared/utils/unit-test.utils";

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
});
