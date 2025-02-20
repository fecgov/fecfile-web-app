import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ErrorMessagesComponent } from '../../error-messages/error-messages.component';
import { testMockStore, testTemplateMap } from 'app/shared/utils/unit-test.utils';
import { LinkedReportInputComponent } from './linked-report-input.component';
import { FecDatePipe } from 'app/shared/pipes/fec-date.pipe';
import { provideMockStore } from '@ngrx/store/testing';
import { ReportService } from 'app/shared/services/report.service';
import { firstValueFrom, of } from 'rxjs';
import { Form3X } from 'app/shared/models/form-3x.model';
import { F3xReportCodes } from 'app/shared/utils/report-code.utils';
import { SubscriptionFormControl } from 'app/shared/utils/subscription-form-control';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('LinkedReportInputComponent', () => {
  let component: LinkedReportInputComponent;
  let fixture: ComponentFixture<LinkedReportInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputTextModule, ReactiveFormsModule, FormsModule, LinkedReportInputComponent, ErrorMessagesComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        ReportService,
        FecDatePipe,
        provideMockStore(testMockStore),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LinkedReportInputComponent);
    component = fixture.componentInstance;
    component.templateMap = Object.assign(testTemplateMap, {
      date2: 'other_date',
    });
    component.form = new FormGroup({}, { updateOn: 'blur' });
    component.form.addControl('other_date', new SubscriptionFormControl());
    component.form.addControl(testTemplateMap['date'], new SubscriptionFormControl());
    component.ngOnInit();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should try to determine the linked F3X report when the dates change', async () => {
    const spy = spyOn(component, 'getLinkedForm3X').and.returnValue(Promise.resolve(Form3X.fromJSON({})));

    component.form.get('other_date')?.setValue('2025-02-12');
    component.form.get(testTemplateMap['date'])?.setValue('2025-02-12');

    fixture.detectChanges();

    expect(spy).toHaveBeenCalledTimes(4);
  });

  it('should determine the correct label', () => {
    const testF3X = Form3X.fromJSON({
      coverage_from_date: '2020-01-15',
      coverage_through_date: '2020-04-29',
      report_code: F3xReportCodes.Q1,
      report_code_label: 'APRIL 15 (Q1)',
    });

    component.committeeF3xReports = firstValueFrom(of([testF3X]));

    component.form.get('other_date')?.setValue(new Date('2020-02-21'));
    component.getLinkedForm3X(undefined, new Date('2020-02-21')).then((report) => {
      expect(report).toEqual(testF3X);
      expect(component.getForm3XLabel(report)).toEqual('APRIL 15 (Q1): 01/15/2020 - 04/29/2020');
    });

    component.form.get('other_date')?.setValue(new Date('2022-06-22'));
    component.getLinkedForm3X(undefined, new Date('2022-06-22')).then((report) => {
      expect(report).toEqual(undefined);
      expect(component.getForm3XLabel(report)).toEqual('');
    });
  });
});
