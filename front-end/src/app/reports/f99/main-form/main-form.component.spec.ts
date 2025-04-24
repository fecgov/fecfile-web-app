/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { MainFormComponent } from './main-form.component';
import { provideMockStore } from '@ngrx/store/testing';
import { testMockStore } from 'app/shared/utils/unit-test.utils';
import { LabelPipe } from 'app/shared/pipes/label.pipe';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { FecDatePipe } from 'app/shared/pipes/fec-date.pipe';
import { SelectButtonModule } from 'primeng/selectbutton';
import { RadioButtonModule } from 'primeng/radiobutton';
import { DatePickerModule } from 'primeng/datepicker';
import { Form99Service } from 'app/shared/services/form-99.service';
import { DividerModule } from 'primeng/divider';
import { SelectModule } from 'primeng/select';
import { provideRouter, Router } from '@angular/router';
import { Form99 } from 'app/shared/models/form-99.model';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ReportListComponent } from 'app/reports/report-list/report-list.component';
import { PrintPreviewComponent } from 'app/reports/shared/print-preview/print-preview.component';

describe('MainFormComponent', () => {
  let component: MainFormComponent;
  let fixture: ComponentFixture<MainFormComponent>;
  let router: Router;
  let form99Service: Form99Service;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        SelectButtonModule,
        DividerModule,
        SelectModule,
        RadioButtonModule,
        DatePickerModule,
        ReactiveFormsModule,
        MainFormComponent,
        LabelPipe,
        PrintPreviewComponent,
      ],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([
          { path: 'reports', pathMatch: 'full', component: ReportListComponent },
          { path: 'reports/f99/web-print/999', pathMatch: 'full', component: PrintPreviewComponent },
        ]),
        Form99Service,
        FormBuilder,
        MessageService,
        FecDatePipe,
        provideMockStore(testMockStore),
      ],
    });
    router = TestBed.inject(Router);
    form99Service = TestBed.inject(Form99Service);
    fixture = TestBed.createComponent(MainFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should go back', () => {
    const navigateSpy = spyOn(router, 'navigateByUrl');
    component.goBack();
    expect(navigateSpy).toHaveBeenCalledWith('/reports');
  });

  it('should save', fakeAsync(() => {
    component.form().patchValue({
      message_text: 'message',
    });
    const createSpy = spyOn(form99Service, 'create').and.callFake(async () => Form99.fromJSON({}));
    const updateSpy = spyOn(form99Service, 'update').and.callFake(async () => Form99.fromJSON({}));
    const navigateSpy = spyOn(router, 'navigateByUrl');

    component.save().then(() => {
      expect(navigateSpy).toHaveBeenCalledWith('/reports');
      expect(createSpy).toHaveBeenCalledTimes(1);

      (component.reportId as any) = '999';
      component.save('continue');

      expect(navigateSpy).toHaveBeenCalledWith('/reports');
      expect(updateSpy).toHaveBeenCalledTimes(1);
    });
  }));
});
