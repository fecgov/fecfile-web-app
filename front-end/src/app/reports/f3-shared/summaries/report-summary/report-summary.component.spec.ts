import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ReportSummaryComponent } from './report-summary.component';
import { getLineSummaries } from './lines';
import { FORM_3_SERVICE } from 'app/shared/services/base-form-3.service';
import { ApiService } from 'app/shared/services/api.service';
import { testElectionCycle, testF3 } from 'app/shared/utils/unit-test.utils';
import { inputBinding, signal } from '@angular/core';
import { BaseForm3 } from 'app/shared/models/reports/base-form-3';

const f3 = testF3();
f3.electionCycle = testElectionCycle();
const report = signal<BaseForm3>(f3);

describe('ReportSummaryComponent', () => {
  let fixture: ComponentFixture<ReportSummaryComponent>;
  let component: ReportSummaryComponent;
  let router: Router;

  const navigateByUrl = vi.fn();
  const navigate = vi.fn();

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReportSummaryComponent],
      providers: [
        {
          provide: FORM_3_SERVICE,
          useValue: {
            isF3X: false,
            get: vi.fn(),
          },
        },
        { provide: ApiService, useValue: { post: vi.fn() } },
      ],
    });

    fixture = TestBed.createComponent(ReportSummaryComponent, { bindings: [inputBinding('report', report)] });
    component = fixture.componentInstance;
    router = TestBed.inject(Router);

    vi.spyOn(router, 'navigateByUrl').mockImplementation(navigateByUrl);
    vi.spyOn(router, 'navigate').mockImplementation(navigate);
    fixture.detectChanges();
  });

  it('should create', async () => {
    expect(component).toBeTruthy();
  });

  describe('lines', () => {
    it('should get line summaries from the report', () => {
      expect(component.lines()).toEqual(getLineSummaries(testF3()));
    });
  });

  describe('template', () => {
    it('should display the summary table when calculation has finished', async () => {
      expect(fixture.nativeElement.querySelector('app-table')).not.toBeNull();
      expect(fixture.nativeElement.querySelector('.fec-loader-div')).toBeNull();
    });

    it('should display the loading indicator when calculation has not finished', () => {
      const testReport = testF3();
      testReport.calculation_status = 'PENDING';
      report.set(testReport);
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector('app-table')).toBeNull();
      expect(fixture.nativeElement.querySelector('.fec-loader-div')).not.toBeNull();
    });
  });

  describe('navigation', () => {
    it('should navigate to the report transactions page', () => {
      const button = fixture.nativeElement.querySelector('button.p-button-secondary') as HTMLButtonElement;
      button.click();
      expect(navigateByUrl).toHaveBeenCalledWith('/reports/transactions/report/999/list');
    });

    it('should navigate to the detailed summary page', () => {
      const button = fixture.nativeElement.querySelector('button.p-button-primary') as HTMLButtonElement;
      button.click();
      expect(navigate).toHaveBeenCalledWith(['/reports', 'f3', 'detailed-summary', '999']);
    });
  });
});
