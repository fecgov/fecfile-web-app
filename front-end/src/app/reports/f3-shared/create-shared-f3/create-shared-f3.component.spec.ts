import { signal } from '@angular/core';
import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CreateSharedF3Component } from './create-shared-f3.component';
import { FORM_3_SERVICE } from 'app/shared/services/base-form-3.service';
import { MessageWrapperService } from 'app/shared/services/message-wrapper.service';
import { BreakpointStore } from 'app/store/breakpoint.store';
import { CommitteeStore } from 'app/committee/committee.store';
import { ElectionCycleService } from 'app/tools/election-cycle/election-cycle.service';
import { F3FormTypes, Form3 } from 'app/shared/models';
import { FilingFrequency, ReportCodes } from 'app/shared/utils/report-code.utils';
import { ReportTypeCategories } from './shared-form3.model';
import { SharedForm3Store } from './shared-form3.store';

describe('CreateSharedF3Component', () => {
  let fixture: ComponentFixture<CreateSharedF3Component>;
  let component: CreateSharedF3Component;

  let reportStoreMock: {
    report: ReturnType<typeof signal<Form3 | null>>;
    isF3X: boolean;
    usedReportCodes: ReturnType<typeof signal<ReportCodes[]>>;
  };

  let activeServiceMock: {
    isF3X: boolean;
    create: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
  };

  let messageServiceMock: {
    success: ReturnType<typeof vi.fn>;
  };

  let breakpointStoreMock: {
    isAtLeast: ReturnType<typeof vi.fn>;
  };

  let committeeStoreMock: {
    filingFrequency: ReturnType<typeof signal<'Q' | 'M'>>;
    committee: ReturnType<typeof signal<{ candidate_state: string } | null>>;
  };

  beforeEach(async () => {
    reportStoreMock = {
      report: signal<Form3 | null>(null),
      isF3X: false,
      usedReportCodes: signal<ReportCodes[]>([]),
    };

    activeServiceMock = {
      isF3X: false,
      create: vi.fn().mockResolvedValue({ id: 'new-report-id' }),
      update: vi.fn().mockResolvedValue({ id: 'updated-report-id' }),
    };

    messageServiceMock = {
      success: vi.fn(),
    };

    breakpointStoreMock = {
      isAtLeast: vi.fn().mockReturnValue(false),
    };

    committeeStoreMock = {
      filingFrequency: signal<FilingFrequency>('Q'),
      committee: signal({ candidate_state: 'VA' }),
    };

    await TestBed.configureTestingModule({
      imports: [CreateSharedF3Component],
      providers: [provideRouter([]), CookieService, { provide: FORM_3_SERVICE, useValue: activeServiceMock }],
    })
      .overrideComponent(CreateSharedF3Component, {
        set: {
          template: '',
          imports: [],
          providers: [
            { provide: BreakpointStore, useValue: breakpointStoreMock },
            { provide: MessageWrapperService, useValue: messageServiceMock },
            { provide: ElectionCycleService, useValue: {} },
            { provide: CommitteeStore, useValue: committeeStoreMock },
            { provide: SharedForm3Store, useValue: reportStoreMock },
          ],
        },
      })
      .compileComponents();
  });

  function setup(report: Form3 | null = null): void {
    reportStoreMock.report.set(report);

    fixture = TestBed.createComponent(CreateSharedF3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  function createExistingReport(): Form3 {
    return Form3.fromJSON({
      id: 'report-123',
      form_type: F3FormTypes.F3N,
      report_code: ReportCodes.Q1,
      report_type_category: ReportTypeCategories.ELECTION_YEAR,
      coverage_from_date: new Date(2026, 0, 1),
      coverage_through_date: new Date(2026, 2, 31),
    });
  }

  describe('Create mode', () => {
    beforeEach(() => {
      setup();
    });

    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with default report code', () => {
      expect(component.model().reportCode).toBe('Q1');
    });

    it('should initialize the election state from the committee', () => {
      expect(component.model().electionReport.state).toBe('VA');
    });

    it('should initialize an coverage period based on report code', () => {
      expect(component.model().coverage).toEqual({
        startDate: new Date(2026, 0, 1),
        endDate: new Date(2026, 2, 31),
      });
    });

    it('should call the create service when creating a report', async () => {
      component.model.update((model) => ({
        ...model,
        reportTypeCategory: ReportTypeCategories.ELECTION_YEAR,
        reportCode: ReportCodes.Q1,
        coverage: {
          startDate: new Date(2026, 0, 1),
          endDate: new Date(2026, 2, 31),
        },
      }));

      await component.create(
        component.form().value(),
        component.activeService.isF3X,
        !component.form.electionReport().hidden(),
      );

      expect(activeServiceMock.create).toHaveBeenCalledOnce();
      expect(activeServiceMock.update).not.toHaveBeenCalled();
    });
  });

  describe('Edit mode', () => {
    let existingReport: Form3;

    beforeEach(() => {
      existingReport = createExistingReport();
      setup(existingReport);
    });

    it('should initialize the model from the existing report', () => {
      expect(component.model().reportCode).toBe(existingReport.report_code);

      expect(component.model().reportTypeCategory).toBe(existingReport.report_type_category);

      expect(component.model().coverage).toEqual({
        startDate: existingReport.coverage_from_date,
        endDate: existingReport.coverage_through_date,
      });
    });
  });
});
