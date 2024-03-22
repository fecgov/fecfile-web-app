import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { FormTypes } from 'app/shared/utils/form-type.utils';
import { RouterTestingModule } from '@angular/router/testing';

import { Dialog, DialogModule } from 'primeng/dialog';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { testMockStore } from 'app/shared/utils/unit-test.utils';
import { of } from 'rxjs';
import { Form24 } from 'app/shared/models/form-24.model';
import { Form3X } from 'app/shared/models/form-3x.model';
import { ReportTypes } from 'app/shared/models/report.model';
import { SecondaryReportSelectionDialogComponent } from './secondary-report-selection-dialog.component';
import { ReportService } from 'app/shared/services/report.service';
import { TransactionService } from 'app/shared/services/transaction.service';
import { DatePipe } from '@angular/common';
import { LabelPipe } from 'app/shared/pipes/label.pipe';
import { MessageService, SharedModule } from 'primeng/api';

describe('SecondaryReportSelectionDialogComponent', () => {
  let component: SecondaryReportSelectionDialogComponent;
  let fixture: ComponentFixture<SecondaryReportSelectionDialogComponent>;
  let router: Router;
  let transactionService: TransactionService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          {
            path: 'reports/transactions/report/2401/list',
            redirectTo: '',
          },
        ]),
        DialogModule,
        HttpClientTestingModule,
      ],
      declarations: [Dialog, SecondaryReportSelectionDialogComponent, LabelPipe],
      providers: [
        ReportService,
        TransactionService,
        MessageService,
        DatePipe,
        provideMockStore(testMockStore),
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

    fixture = TestBed.createComponent(SecondaryReportSelectionDialogComponent);
    router = TestBed.inject(Router);
    transactionService = TestBed.inject(TransactionService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /*describe('dropdownButtonText', () => {
    it('should return an empty span if there is no selected type', () => {
      expect(component.dropdownButtonText).toEqual('<span></span>');
    });
    it('should return a correctly formatted string if there is a selected type', () => {
      component.selectedType = FormTypes.F3X;
      expect(component.dropdownButtonText).toEqual(
        '<span class="option"><b>Form 3X:</b> Report of Receipts and Disbursements</span>',
      );
    });
  });

  describe('updateSelected', () => {
    it('should set the selectedType to the provided type', () => {
      component.updateSelected(FormTypes.F3X);
      expect(component.selectedType).toEqual(FormTypes.F3X);
    });
  });

  it('should create Form24', () => {
    component.updateSelected(FormTypes.F24);
    expect(component.selectedType).toEqual(FormTypes.F24);

    component.selectedForm24Type = '48';

    const create = spyOn(form24Service, 'create').and.returnValue(
      of(
        Form24.fromJSON({
          id: 2401,
        }),
      ),
    );

    component.goToReportForm();
    expect(create).toHaveBeenCalled();
  });*/
});
