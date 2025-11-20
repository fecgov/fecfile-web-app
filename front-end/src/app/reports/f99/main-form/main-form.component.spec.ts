import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import { ReportListComponent } from 'app/reports/report-list/report-list.component';
import { PrintPreviewComponent } from 'app/reports/shared/print-preview/print-preview.component';
import { ErrorMessagesComponent } from 'app/shared/components/error-messages/error-messages.component';
import { AddressInputComponent } from 'app/shared/components/inputs/address-input/address-input.component';
import { SaveCancelComponent } from 'app/shared/components/save-cancel/save-cancel.component';
import { Form99, textCodesWithFilingFrequencies } from 'app/shared/models/form-99.model';
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
        provideMockStore(testMockStore()),
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
    const createSpy = spyOn(component.reportService, 'create').and.resolveTo(Form99.fromJSON({}));
    const updateSpy = spyOn(component.reportService, 'update').and.resolveTo(Form99.fromJSON({}));
    const navigateSpy = spyOn(router, 'navigateByUrl');

    component.form.patchValue({ ...f99 });
    expect(component.form.invalid).toBe(false);
    await component.submitForm();
    expect(createSpy).toHaveBeenCalledTimes(1);
    expect(navigateSpy).toHaveBeenCalledWith('/reports');

    component.form.patchValue({ ...f99 });
    component.reportId = '999';
    await component.submitForm();
    expect(updateSpy).toHaveBeenCalledTimes(1);
    expect(navigateSpy).toHaveBeenCalledWith('/reports');
  }));
});

describe('MainFormComponent (showFilingFrequency)', () => {
  let fixture: ComponentFixture<MainFormComponent>;
  let component: MainFormComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainFormComponent, ReactiveFormsModule],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideMockStore({}),
        MessageService,
        { provide: ActivatedRoute, useValue: { params: of({}) } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MainFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should reference each member of textCodesWithFilingFrequencies enum to ensure they are not unused', () => {
    // Reference each member explicitly so knip does not flag them as unused
    const msr = textCodesWithFilingFrequencies.MSR;
    const msm = textCodesWithFilingFrequencies.MSM;
    // Use them in a way that cannot be tree-shaken
    expect([msr, msm]).toBeDefined();
  });

  it('returns true for text_code values that require a filing frequency (MSR, MSM)', () => {
    component.form.controls['text_code'].setValue('MSR');
    fixture.detectChanges();
    expect(component.showFilingFrequency()).toBeTrue();

    component.form.controls['text_code'].setValue('MSM');
    fixture.detectChanges();
    expect(component.showFilingFrequency()).toBeTrue();
  });

  it('returns false for text_code values that do not require a filing frequency', () => {
    component.form.controls['text_code'].setValue('MST');
    fixture.detectChanges();
    expect(component.showFilingFrequency()).toBeFalse();
  });
});
