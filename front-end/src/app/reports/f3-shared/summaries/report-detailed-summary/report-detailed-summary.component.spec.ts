import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { inputBinding, signal } from '@angular/core';
import { ReportDetailedSummaryComponent } from './report-detailed-summary.component';
import { getF3Lines } from 'app/reports/f3-shared/summaries/report-detailed-summary/f3-detailed-line-summaries';
import { getF3XLines } from 'app/reports/f3-shared/summaries/report-detailed-summary/f3x-detailed-line-summaries';
import { FORM_3_SERVICE } from 'app/shared/services/base-form-3.service';
import { ApiService } from 'app/shared/services/api.service';
import { testElectionCycle, testF3, testActiveReport } from 'app/shared/utils/unit-test.utils';
import { BaseForm3 } from 'app/shared/models/reports/base-form-3';
import { Form3 } from 'app/shared/models/reports/form-3.model';
import { Form3X } from 'app/shared/models/reports/form-3x.model';

describe('ReportDetailedSummaryComponent', () => {
  let fixture: ComponentFixture<ReportDetailedSummaryComponent>;
  let component: ReportDetailedSummaryComponent;
  let router: Router;

  const navigate = vi.fn();
  let report: ReturnType<typeof signal<BaseForm3>>;
  let form3ServiceMock: { isF3X: boolean; get: ReturnType<typeof vi.fn> };

  const createComponent = (isF3X = false, initialReport: BaseForm3 = testF3()) => {
    form3ServiceMock = {
      isF3X,
      get: vi.fn(),
    };

    report = signal<BaseForm3>(initialReport);

    TestBed.configureTestingModule({
      imports: [ReportDetailedSummaryComponent],
      providers: [
        { provide: FORM_3_SERVICE, useValue: form3ServiceMock },
        { provide: ApiService, useValue: { post: vi.fn() } },
      ],
    });

    fixture = TestBed.createComponent(ReportDetailedSummaryComponent, {
      bindings: [inputBinding('report', report)],
    });
    component = fixture.componentInstance;
    router = TestBed.inject(Router);

    vi.spyOn(router, 'navigate').mockImplementation(navigate);
    fixture.detectChanges();
  };

  describe('Form 3', () => {
    beforeEach(() => {
      const f3 = testF3();
      f3.electionCycle = testElectionCycle();
      createComponent(false, f3);
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    describe('computed signals', () => {
      it('should compute lines using getF3Lines', () => {
        expect(component.lines()).toEqual(getF3Lines(report() as Form3));
      });

      it('should set thirdTitle to "Cash summary"', () => {
        expect(component.thirdTitle()).toBe('Cash summary');
      });
    });

    describe('template', () => {
      it('should display the summary tables when calculation has finished', () => {
        const tables = fixture.nativeElement.querySelectorAll('app-table');
        expect(tables).toHaveLength(3);
        expect(fixture.nativeElement.querySelector('.fec-loader-div')).toBeNull();
      });

      it('should display the loading indicator when calculation has not finished', () => {
        const pendingReport = testF3();
        pendingReport.calculation_status = 'PENDING';
        report.set(pendingReport);
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelectorAll('app-table')).toHaveLength(0);
        expect(fixture.nativeElement.querySelector('.fec-loader-div')).not.toBeNull();
      });
    });

    describe('navigation', () => {
      it('should navigate back to the summary page', () => {
        const button = fixture.nativeElement.querySelector('button.p-button-secondary') as HTMLButtonElement;
        button.click();
        expect(navigate).toHaveBeenCalledWith(['/reports', 'f3', 'summary', '999']);
      });

      it('should navigate to the web-print preview page', () => {
        const button = fixture.nativeElement.querySelector('button.p-button-primary') as HTMLButtonElement;
        button.click();
        expect(navigate).toHaveBeenCalledWith(['/reports', 'f3', 'web-print', '999']);
      });
    });
  });

  describe('Form 3X', () => {
    beforeEach(() => {
      TestBed.resetTestingModule();
      const f3x = testActiveReport();
      createComponent(true, f3x);
    });

    it('should compute lines using getF3XLines', () => {
      expect(component.lines()).toEqual(getF3XLines(report() as Form3X));
    });

    it('should set thirdTitle to "Net contributions/operating expenditures"', () => {
      expect(component.thirdTitle()).toBe('Net contributions/operating expenditures');
    });

    it('should navigate back to the f3x summary page', () => {
      const button = fixture.nativeElement.querySelector('button.p-button-secondary') as HTMLButtonElement;
      button.click();
      expect(navigate).toHaveBeenCalledWith(['/reports', 'f3x', 'summary', '999']);
    });
  });
});
