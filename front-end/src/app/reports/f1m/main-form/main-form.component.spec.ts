import { MainFormComponent } from './main-form.component';
import { provideMockStore } from '@ngrx/store/testing';
import { initialState as initActiveReport } from 'app/store/active-report.reducer';
import { selectActiveReport } from 'app/store/active-report.selectors';
import { LabelPipe } from 'app/shared/pipes/label.pipe';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FecDatePipe } from 'app/shared/pipes/fec-date.pipe';
import { SelectButtonModule } from 'primeng/selectbutton';
import { RadioButtonModule } from 'primeng/radiobutton';
import { DatePickerModule } from 'primeng/datepicker';
import { Form1MService } from 'app/shared/services/form-1m.service';
import { DividerModule } from 'primeng/divider';
import { SelectModule } from 'primeng/select';
import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { Contact } from 'app/shared/models/contact.model';
import { Form1M } from 'app/shared/models/form-1m.model';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { testCommitteeAccount } from 'app/shared/utils/unit-test.utils';
import { selectCommitteeAccount } from 'app/store/committee-account.selectors';

describe('MainFormComponent', () => {
  let component: MainFormComponent;
  let fixture: ComponentFixture<MainFormComponent>;
  const testActiveReport: Form1M = Form1M.fromJSON({
    id: '11111-11111-111111-1111111',
    affiliated_committee_name: 'committee name',
    contact_affiliated: {
      id: '22222-22222-22222-2222222',
      committee_id: 'C000000005',
    },
    contact_affiliated_id: '22222-22222-22222-2222222',
  });
  const testMockStore = {
    initialState: {
      fecfile_online_activeReport: initActiveReport,
    },
    selectors: [
      { selector: selectActiveReport, value: testActiveReport },
      { selector: selectCommitteeAccount, value: testCommitteeAccount },
    ],
  };

  beforeAll(async () => {
    await import(`fecfile-validate/fecfile_validate_js/dist/F1M.validator`);
    await import(`fecfile-validate/fecfile_validate_js/dist/Contact_Candidate.validator`);
    await import(`fecfile-validate/fecfile_validate_js/dist/Contact_Committee.validator`);
    await import(`fecfile-validate/fecfile_validate_js/dist/Contact_Individual.validator`);
  });

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
      ],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
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

  it('ngOnInit should set form controls', fakeAsync(() => {
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
    tick(100);
    flush();
    expect(component.form.get('affiliated_committee_name')?.valid).toBeTrue();
  }));

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

  it('Update a contact from the contact lookup', () => {
    fixture.detectChanges();
    const committee = Contact.fromJSON({
      id: '11111-2222222-333333-444444444',
      committee_id: 'C000000001',
      name: 'Organization Name',
      type: 'ORG',
    });

    component.affiliatedContact.manager.outerContact.set(committee);
    component.affiliatedContact.update(committee);
    expect(component.report.contact_affiliated_id).toEqual('11111-2222222-333333-444444444');
    expect(component.form.get('affiliated_committee_fec_id')?.value).toEqual('C000000001');
    expect(component.form.get('affiliated_committee_name')?.value).toEqual('Organization Name');
    expect(component.affiliatedContact.manager.excludeIds()).toEqual('11111-2222222-333333-444444444');
    expect(component.affiliatedContact.manager.excludeFecIds()).toEqual('C000000001');

    const candidate = Contact.fromJSON({
      id: '22222-33333333-444444-55555555',
      candidate_id: 'C000000002',
      last_name: 'Smith',
      type: 'CAN',
    });

    component.candidateContacts[0].manager.outerContact.set(candidate);
    component.candidateContacts[0].update(candidate);
    expect(component.report.contact_candidate_I?.id).toEqual('22222-33333333-444444-55555555');
    expect(component.form.get('I_candidate_id_number')?.value).toEqual('C000000002');
    expect(component.form.get('I_candidate_last_name')?.value).toEqual('Smith');
    expect(component.candidateContacts[0].manager.excludeIds()).toEqual(
      '22222-33333333-444444-55555555,11111-2222222-333333-444444444',
    );
    expect(component.candidateContacts[0].manager.excludeFecIds()).toEqual('C000000002,C000000001');

    expect(component.candidateContacts[0].dateOfContributionField).toEqual('I_date_of_contribution');
    expect(component.candidateContacts[0].candidateId).toEqual('C000000002');
  });

  // Unit test is broken because of Async problems
  xit('Exclude ids should prepopulate when editing a F1M', () => {
    fixture.detectChanges();
    component.ngOnInit();
    expect(component.affiliatedContact.manager.excludeFecIds()).toEqual('C000000005');
    expect(component.affiliatedContact.manager.excludeIds()).toEqual('22222-22222-22222-2222222');
  });
});
