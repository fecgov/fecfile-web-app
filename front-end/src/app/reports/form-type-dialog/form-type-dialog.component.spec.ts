import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { FormTypes } from 'app/shared/utils/form-type.utils';
import { FormTypeDialogComponent } from './form-type-dialog.component';
import { Dialog, DialogModule } from 'primeng/dialog';
import { Form24Service } from 'app/shared/services/form-24.service';
import { provideMockStore } from '@ngrx/store/testing';
import { testMockStore } from 'app/shared/utils/unit-test.utils';
import { of } from 'rxjs';
import { Form24 } from 'app/shared/models/form-24.model';
import { Form3X } from 'app/shared/models/form-3x.model';
import { ReportTypes } from 'app/shared/models/report.model';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MessageService } from 'primeng/api';

describe('FormTypeDialogComponent', () => {
  let component: FormTypeDialogComponent;
  let fixture: ComponentFixture<FormTypeDialogComponent>;
  let router: Router;
  let form24Service: Form24Service;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogModule, Dialog, FormTypeDialogComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([
          {
            path: 'reports/transactions/report/2401/list',
            redirectTo: '',
          },
        ]),
        Form24Service,
        provideMockStore(testMockStore),
        MessageService,
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
      component.selectedType.set(FormTypes.F3X);
      component.goToReportForm();
      expect(navigateSpy).toHaveBeenCalledWith('/reports/f3x/create/step1');
    });
  });

  describe('updateSelected', () => {
    it('should set the selectedType to the provided type', () => {
      component.selectedType.set(FormTypes.F3X);
      expect(component.selectedType()).toEqual(FormTypes.F3X);
    });
  });

  it('should create Form24', () => {
    component.selectedType.set(FormTypes.F24);
    expect(component.selectedType()).toEqual(FormTypes.F24);

    component.f24().selectedForm24Type.set('48');

    const create = spyOn(form24Service, 'create').and.returnValue(
      Promise.resolve(
        Form24.fromJSON({
          id: 2401,
        }),
      ),
    );

    component.goToReportForm();
    expect(create).toHaveBeenCalled();
  });
});
