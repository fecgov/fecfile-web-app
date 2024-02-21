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
import { ActivatedRoute } from '@angular/router';
import { Contact } from 'app/shared/models/contact.model';
import { Form1M } from 'app/shared/models/form-1m.model';

describe('MainFormComponent', () => {
  let component: MainFormComponent;
  let fixture: ComponentFixture<MainFormComponent>;
  const testActiveReport: Form1M = Form1M.fromJSON({ id: '99', affiliated_committee_name: 'abc' });
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
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { params: { reportId: '99' } },
          },
        },
      ],
    });
    fixture = TestBed.createComponent(MainFormComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('ngOnInit should set up an edited report', () => {
    fixture.detectChanges();
    expect(component.form.get('statusBy')?.value).toBe('affiliation');
  });

  it('ngOnInit should set form controls', () => {
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
    component.report.contact_affiliated = contact_affiliated;

    component.ngOnInit();
    component.form.patchValue({ statusBy: 'affiliation' });
    component.form.patchValue({ affiliated_committee_name: '' });
    fixture.detectChanges();
    expect(component.form.get('affiliated_committee_name')?.valid).toBeFalse();

    component.form.patchValue({ statusBy: 'qualification' });
    fixture.detectChanges();
    expect(component.form.get('affiliated_committee_name')?.valid).toBeTrue();
  });

  it('getReportPayload should update and return the report properties', () => {
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
      affiliated_committee_fec_id: 'C00000002',
      affiliated_committee_name: 'affiliated committee',
    });

    const contact_affiliated = Contact.fromJSON({
      id: '10',
      name: 'committee name',
      committee_id: 'C000000009',
    });

    component.report = Form1M.fromJSON({
      id: '99',
      committee_name: 'replaced committee',
      contact_affiliated: contact_affiliated,
    });
    component.report.contact_affiliated = contact_affiliated;

    const payload = component.getReportPayload();
    expect((payload as Form1M).contact_affiliated?.name).toBe('affiliated committee');
    expect((payload as Form1M).contact_affiliated?.committee_id).toBe('C00000002');
    expect((payload as Form1M).committee_name).toBe('test committee');
  });

  it('getSelectedContactIds() should return correct ids', () => {
    fixture.detectChanges();
    component.form.patchValue({
      statusBy: 'qualification',
      I_candidate_id_number: 'P00000001',
      II_candidate_id_number: 'P00000002',
      III_candidate_id_number: 'P00000003',
    });

    let candidateIds = component.getSelectedContactIds();
    expect(candidateIds.length).toBe(3);
    expect(candidateIds.includes('P00000001')).toBeTrue();
    expect(candidateIds.includes('P00000002')).toBeTrue();
    expect(candidateIds.includes('P00000003')).toBeTrue();
    expect(candidateIds.includes('P00000004')).toBeFalse();

    candidateIds = component.getSelectedContactIds('II');
    expect(candidateIds.length).toBe(2);
    expect(candidateIds.includes('P00000001')).toBeTrue();
    expect(candidateIds.includes('P00000002')).toBeFalse();
    expect(candidateIds.includes('P00000003')).toBeTrue();
    expect(candidateIds.includes('P00000004')).toBeFalse();

    // Verify duplicating a candidtate id invalidates the form control.
    const control = component.form.get('II_candidate_id_number');
    expect(control).toBeTruthy();
    expect(control?.valid).toBeTrue();
    control?.setValue('P00000001');
    expect(control?.valid).toBeFalse();
    control?.setValue('P00000002');
    expect(control?.valid).toBeTrue();
  });
});
