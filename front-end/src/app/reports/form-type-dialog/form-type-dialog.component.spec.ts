import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { FormTypes } from 'app/shared/utils/form-type.utils';
import { RouterTestingModule } from '@angular/router/testing';

import { FormTypeDialogComponent } from './form-type-dialog.component';
import { Dialog, DialogModule } from 'primeng/dialog';
import { Form24Service } from 'app/shared/services/form-24.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { testMockStore } from 'app/shared/utils/unit-test.utils';
import { of } from 'rxjs';
import { Form24 } from 'app/shared/models/form-24.model';
import { Form3X } from 'app/shared/models/form-3x.model';
import { ReportTypes } from 'app/shared/models/report.model';

describe('FormTypeDialogComponent', () => {
  let component: FormTypeDialogComponent;
  let fixture: ComponentFixture<FormTypeDialogComponent>;
  let router: Router;
  let form24Service: Form24Service;

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
      declarations: [Dialog, FormTypeDialogComponent],
      providers: [
        Form24Service,
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
    it('should route properly', () => {
      const navigateSpy = spyOn(router, 'navigateByUrl');
      component.selectedType = FormTypes.F3X;
      component.goToReportForm();
      expect(navigateSpy).toHaveBeenCalledWith('/reports/f3x/create/step1');
    });
  });

  describe('dropdownButtonText', () => {
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
  });
});
