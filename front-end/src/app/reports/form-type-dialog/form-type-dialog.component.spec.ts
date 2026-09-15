import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter, ActivatedRoute } from '@angular/router';
import { provideMockStore } from '@ngrx/store/testing';
import { CommitteeStore } from 'app/committee/committee.store';
import { Form24SignalSchema, Form3X, ReportTypes, Form24 } from 'app/shared/models';
import { Form24Service } from 'app/shared/services/form-24.service';
import { testMockStore, testCommitteeAccount } from 'app/shared/utils/unit-test.utils';
import { MessageService } from 'primeng/api';
import { DialogModule, Dialog } from 'primeng/dialog';
import { of } from 'rxjs';
import { FormTypeDialogComponent } from './form-type-dialog.component';

describe('FormTypeDialogComponent', () => {
  let component: FormTypeDialogComponent;
  let fixture: ComponentFixture<FormTypeDialogComponent>;
  let router: Router;
  let form24Service: Form24Service;
  let committeeStore: CommitteeStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogModule, Dialog, FormTypeDialogComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideMockStore(testMockStore()),
        provideRouter([
          {
            path: 'reports/transactions/report/2401/list',
            redirectTo: '',
          },
        ]),
        Form24Service,
        CommitteeStore,
        MessageService,
        Form24SignalSchema,
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {
                report: Form3X.fromJSON({
                  report_type: ReportTypes.F3X,
                }),
              },
            },
            params: of({
              catalog: 'receipt',
            }),
          },
        },
      ],
    }).compileComponents();

    committeeStore = TestBed.inject(CommitteeStore);
    fixture = TestBed.createComponent(FormTypeDialogComponent);
    router = TestBed.inject(Router);
    form24Service = TestBed.inject(Form24Service);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('goToReportForm', () => {
    it('should route properly', async () => {
      const navigateSpy = vi.spyOn(router, 'navigateByUrl');
      component.reportForm.type().value.set(ReportTypes.F3X);
      await component.submitForm();
      expect(navigateSpy).toHaveBeenCalledWith('/reports/f3x/create');
    });
  });

  it('should create Form24', async () => {
    const f24 = Form24.fromJSON({
      id: 2401,
      report_type_24_48: '24',
      name: '24-Hour: test',
    });
    component.reportForm().value.set({
      type: ReportTypes.F24,
      f24: { type: f24.report_type_24_48!, typelessName: 'test' },
    });
    const create = vi.spyOn(form24Service, 'create').mockResolvedValue(f24);

    await component.submitForm();
    expect(create).toHaveBeenCalled();
  });

  it('should filter form types', async () => {
    committeeStore.setCommittee(testCommitteeAccount());
    fixture.detectChanges();
    await fixture.whenStable();
    expect(committeeStore.eligibleReportTypes()).toEqual(new Set(testCommitteeAccount().eligible_report_types));
    expect(component.filteredOptions()).not.toContain('F3');
    expect(component.filteredOptions()).not.toContain('F24');
  });
});
