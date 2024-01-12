import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MainFormComponent } from './main-form.component';
import { provideMockStore } from '@ngrx/store/testing';
import { initialState as initActiveReport } from 'app/store/active-report.reducer';
import { selectActiveReport } from 'app/store/active-report.selectors';
import { LabelPipe } from 'app/shared/pipes/label.pipe';
import { AppSelectButtonComponent } from 'app/shared/components/app-selectbutton.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MessageService, ConfirmationService } from 'primeng/api';
import { FecDatePipe } from 'app/shared/pipes/fec-date.pipe';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SelectButtonModule } from 'primeng/selectbutton';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CalendarModule } from 'primeng/calendar';
import { RouterTestingModule } from '@angular/router/testing';
import { Form1MService } from 'app/shared/services/form-1m.service';
import { SharedModule } from 'app/shared/shared.module';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { Router } from '@angular/router';
import { Contact } from 'app/shared/models/contact.model';
import { Form1M } from 'app/shared/models/form-1m.model';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/F1M';

describe('MainFormComponent', () => {
  let component: MainFormComponent;
  let fixture: ComponentFixture<MainFormComponent>;
  let router: Router;
  const testActiveReport: Form1M = Form1M.fromJSON({ id: '99' });
  const testMockStore = {
    initialState: {
      fecfile_online_activeReport: initActiveReport,
    },
    selectors: [{ selector: selectActiveReport, value: testActiveReport }],
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        SelectButtonModule,
        SharedModule,
        DividerModule,
        DropdownModule,
        RadioButtonModule,
        CalendarModule,
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([]),
      ],
      declarations: [MainFormComponent, LabelPipe, AppSelectButtonComponent],
      providers: [
        ConfirmationService,
        Form1MService,
        FormBuilder,
        MessageService,
        FecDatePipe,
        provideMockStore(testMockStore),
      ],
    });
    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(MainFormComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('ngOnit should set form controls', () => {
    fixture.detectChanges();
    component.form.patchValue({
      committee_type: 'X',
      filer_committee_id_number: 'C000000001',
      committee_name: 'test committee',
      street_1: '123 Main St.',
      street_2: '',
      city: 'test city',
      state: 'DC',
      zip: '22222',
      affiliated_date_form_f1_filed: Date(),
      affiliated_committee_fec_id: 'C00000002',
      affiliated_committee_name: 'affiliated committee',
      statusBy: '',
    });

    const contact_affiliated = Contact.fromJSON({
      id: '10',
    });

    component.report = Form1M.fromJSON({ id: '99', affiliated_committee_name: 'abc' });
    component.reportId = '99';
    component.report.contact_affiliated = contact_affiliated;
    component.schema = schema;

    component.ngOnInit();
    component.form.patchValue({ statusBy: 'affiliation' });
    component.form.patchValue({ affiliated_committee_name: '' });
    fixture.detectChanges();
    expect(component.form.get('affiliated_committee_name')?.valid).toBeFalse();

    component.form.patchValue({ statusBy: 'qualification' });
    fixture.detectChanges();
    expect(component.form.get('affiliated_committee_name')?.valid).toBeTrue();
  });
});
