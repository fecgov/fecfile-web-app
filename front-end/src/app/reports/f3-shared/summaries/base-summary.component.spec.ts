import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { BaseSummaryComponent } from './base-summary.component';
import { FORM_3_SERVICE } from 'app/shared/services/base-form-3.service';
import { ApiService } from 'app/shared/services/api.service';
import { BreakpointStore } from 'app/store/breakpoint.store';
import type { BaseForm3 } from 'app/shared/models/reports/base-form-3';
import type { Form3 } from 'app/shared/models/reports/form-3.model';
import type { ElectionCycle } from 'app/tools/election-cycle/election-cycle.model';

@Component({ standalone: true, template: '' })
class TestSummaryComponent extends BaseSummaryComponent {}

describe('BaseSummaryComponent', () => {
  let fixture: ComponentFixture<TestSummaryComponent>;
  let component: TestSummaryComponent;

  let apiPost: ReturnType<typeof vi.fn>;
  let getReport: ReturnType<typeof vi.fn>;
  let isF3X = false;

  const createReport = (overrides: Partial<Form3> = {}): Form3 =>
    ({
      id: 'report-1',
      calculation_status: 'SUCCEEDED',
      electionCycleId: 'cycle-1',
      nextElectionCycleId: null,
      electionCycle: { id: 'cycle-1' },
      nextElectionCycle: null,
      ...overrides,
    }) as Form3;

  const createComponent = (report: BaseForm3) => {
    fixture = TestBed.createComponent(TestSummaryComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('report', report);
    fixture.detectChanges();
  };

  beforeEach(() => {
    vi.useFakeTimers();
    isF3X = false;
    apiPost = vi.fn().mockResolvedValue(undefined);
    getReport = vi.fn();

    TestBed.configureTestingModule({
      imports: [TestSummaryComponent],
      providers: [
        {
          provide: FORM_3_SERVICE,
          useValue: {
            get isF3X() {
              return isF3X;
            },
            get: getReport,
          },
        },
        { provide: ApiService, useValue: { post: apiPost } },
        { provide: BreakpointStore, useValue: {} },
        { provide: Router, useValue: {} },
      ],
    });
  });

  afterEach(() => {
    fixture?.destroy();
    vi.useRealTimers();
  });

  describe('report properties', () => {
    it('should expose the report type', () => {
      createComponent(createReport());
      expect(component.type()).toBe('F3');
      expect(component.formText).toBe('f3');
    });

    it('should expose the election cycle information', () => {
      const report = createReport();
      createComponent(report);
      expect(component.electionCycle()).toBe(report.electionCycle);
      expect(component.nextElectionCycle()).toBeNull();
    });

    it('should determine whether calculation has finished', () => {
      createComponent(createReport());
      expect(component.calculationFinished()).toBe(true);
      component.report.set(createReport({ calculation_status: 'PENDING' }));
      expect(component.calculationFinished()).toBe(false);
    });

    it('should not expose election cycle information for F3X', () => {
      isF3X = true;
      createComponent(createReport());
      expect(component.type()).toBe('F3X');
      expect(component.formText).toBe('f3x');
      expect(component.electionCycle()).toBeUndefined();
      expect(component.nextElectionCycle()).toBeUndefined();
    });
  });

  describe('ngOnInit', () => {
    it('should not poll when calculation has already succeeded', async () => {
      createComponent(createReport());
      await vi.advanceTimersByTimeAsync(2000);
      expect(apiPost).not.toHaveBeenCalled();
      expect(getReport).not.toHaveBeenCalled();
    });

    it('should request summary calculation when calculation status is undefined', async () => {
      const report = createReport({ calculation_status: undefined });
      const updatedReport = createReport();
      getReport.mockResolvedValue(updatedReport);
      createComponent(report);
      await vi.advanceTimersByTimeAsync(0);
      expect(apiPost).toHaveBeenCalledOnce();
      expect(apiPost).toHaveBeenCalledWith('/web-services/summary/calculate-summary/', { report_id: 'report-1' });
      expect(getReport).toHaveBeenCalledWith('report-1');
      expect(component.report()).toBe(updatedReport);
    });

    it('should poll for the updated report when calculation is already in progress', async () => {
      const report = createReport({ calculation_status: 'PENDING' });
      const updatedReport = createReport();
      getReport.mockResolvedValue(updatedReport);
      createComponent(report);
      await vi.advanceTimersByTimeAsync(0);
      expect(apiPost).not.toHaveBeenCalled();
      expect(getReport).toHaveBeenCalledWith('report-1');
      expect(component.report()).toBe(updatedReport);
    });

    it('should stop polling when calculation succeeds', async () => {
      const report = createReport({ calculation_status: 'PENDING' });
      const pendingReport = createReport({ calculation_status: 'PENDING' });
      const completedReport = createReport();
      getReport.mockResolvedValueOnce(pendingReport).mockResolvedValueOnce(completedReport);
      createComponent(report);
      await vi.advanceTimersByTimeAsync(0);
      expect(component.report()).toBe(pendingReport);
      await vi.advanceTimersByTimeAsync(1000);
      expect(component.report()).toBe(completedReport);
      expect(getReport).toHaveBeenCalledTimes(2);
      await vi.advanceTimersByTimeAsync(3000);
      expect(getReport).toHaveBeenCalledTimes(2);
    });

    it('should preserve election cycle information when updating an F3 report', async () => {
      const electionCycle = { id: 'cycle-1' } as ElectionCycle;
      const nextElectionCycle = { id: 'cycle-2' } as ElectionCycle;
      const report = createReport({
        calculation_status: 'PENDING',
        electionCycle,
        nextElectionCycle,
      });
      const updatedReport = createReport();
      getReport.mockResolvedValue(updatedReport);
      createComponent(report);
      await vi.advanceTimersByTimeAsync(0);
      expect((updatedReport as Form3).electionCycle).toBe(electionCycle);
      expect((updatedReport as Form3).nextElectionCycle).toBe(nextElectionCycle);
    });
  });

  it('should stop polling when the component is destroyed', async () => {
    const report = createReport({ calculation_status: 'PENDING' });
    getReport.mockResolvedValue(report);
    createComponent(report);
    await vi.advanceTimersByTimeAsync(0);
    expect(getReport).toHaveBeenCalledOnce();
    fixture.destroy();
    await vi.advanceTimersByTimeAsync(3000);
    expect(getReport).toHaveBeenCalledOnce();
  });
});
