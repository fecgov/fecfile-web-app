import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { provideRouter, Router } from '@angular/router';
import { provideMockStore } from '@ngrx/store/testing';
import { ReportListComponent } from 'app/reports/report-list/report-list.component';
import { PrintPreviewComponent } from 'app/reports/shared/print-preview/print-preview.component';
import { ErrorMessagesComponent } from 'app/shared/components/error-messages/error-messages.component';
import { AddressInputComponent } from 'app/shared/components/inputs/address-input/address-input.component';
import { SaveCancelComponent } from 'app/shared/components/save-cancel/save-cancel.component';
import { Form99 } from 'app/shared/models/form-99.model';
import { FecDatePipe } from 'app/shared/pipes/fec-date.pipe';
import { LabelPipe } from 'app/shared/pipes/label.pipe';
import { Form99Service } from 'app/shared/services/form-99.service';
import { testMockStore } from 'app/shared/utils/unit-test.utils';
import { MessageService } from 'primeng/api';
import { DatePickerModule } from 'primeng/datepicker';
import { DividerModule } from 'primeng/divider';
import { InputText } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';
import { Select, SelectModule } from 'primeng/select';
import { SelectButton, SelectButtonModule } from 'primeng/selectbutton';
import { TextareaModule } from 'primeng/textarea';
import { MainFormComponent } from './main-form.component';

describe('MainFormComponent', () => {
  let component: MainFormComponent;
  let fixture: ComponentFixture<MainFormComponent>;
  let router: Router;

  const f99: Form99 = Form99.fromJSON({
    id: '999',
    form_type: 'F99',
    filer_committee_id_number: 'C12345678',
    committee_name: 'test_committee_name',
    street_1: 'test_street_1',
    city: 'test_city',
    state: 'AL',
    zip: '12345',
    treasurer_last_name: 'test_last_name',
    treasurer_first_name: 'test_first_name',
    date_signed: '2022-06-25',
    text_code: 'MSI',
    message_text: 'test_message_text',
  });

  beforeEach(async () => {
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
        SelectButton,
        InputText,
        ErrorMessagesComponent,
        AddressInputComponent,
        Select,
        SaveCancelComponent,
        TextareaModule,
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

  it('should save', fakeAsync(async () => {
    const createSpy = spyOn(component.reportService, 'create').and.callFake(
      async () => await Promise.resolve(Form99.fromJSON({})),
    );
    const updateSpy = spyOn(component.reportService, 'update').and.callFake(
      async () => await Promise.resolve(Form99.fromJSON({})),
    );
    const navigateSpy = spyOn(router, 'navigateByUrl');

    component.form.patchValue({ ...f99 });
    expect(component.form.invalid).toBe(false);
    await component.save();
    expect(createSpy).toHaveBeenCalledTimes(1);
    expect(navigateSpy).toHaveBeenCalledWith('/reports');

    component.form.patchValue({ ...f99 });
    component.reportId = '999';
    await component.save();
    expect(updateSpy).toHaveBeenCalledTimes(1);
    expect(navigateSpy).toHaveBeenCalledWith('/reports');
  }));
});
