import { MainFormComponent } from './main-form.component';
import { provideMockStore } from '@ngrx/store/testing';
import { initialState as initActiveReport } from 'app/store/active-report.reducer';
import { selectActiveReport } from 'app/store/active-report.selectors';
import { LabelPipe } from 'app/shared/pipes/label.pipe';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
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
import { createSignal } from '@angular/core/primitives/signals';

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
    expect(component.form().get('statusBy')?.value).toBe('affiliation');
  });

  it('ngOnInit should set form controls', fakeAsync(() => {
    fixture.detectChanges();
    component.form().patchValue({
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

    (component.report as any) = createSignal(Form1M.fromJSON({ id: '99', affiliated_committee_name: 'abc' }));
    component.form1M().contact_affiliated = contact_affiliated;

    component.ngOnInit();
    component.form().patchValue({ statusBy: 'affiliation' });
    component.form().patchValue({ affiliated_committee_name: '' });
    fixture.detectChanges();
    expect(component.form().get('affiliated_committee_name')?.valid).toBeFalse();

    component.form().patchValue({ statusBy: 'qualification' });
    fixture.detectChanges();
    tick(100);
    flush();
    expect(component.form().get('affiliated_committee_name')?.valid).toBeTrue();
  }));

  it('getReportPayload should update and return the report properties', () => {
    fixture.detectChanges();
    component.form().patchValue({
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

    (component.report as any) = createSignal(
      Form1M.fromJSON({
        id: '99',
        committee_name: 'replaced committee',
        contact_affiliated: contact_affiliated,
      }),
    );
    component.form1M().contact_affiliated = contact_affiliated;

    const payload = component.getReportPayload();
    expect((payload as Form1M).contact_affiliated?.name).toBe('affiliated committee');
    expect((payload as Form1M).contact_affiliated?.committee_id).toBe('C00000002');
    expect((payload as Form1M).committee_name).toBe('test committee');
  });

  it('getSelectedContactIds() should return correct ids', fakeAsync(() => {
    fixture.detectChanges();
    component.form().patchValue({
      statusBy: 'qualification',
      I_candidate_id_number: 'P00000001',
      II_candidate_id_number: 'P00000002',
      III_candidate_id_number: 'P00000003',
    });
    tick(100);

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
    const control = component.form().get('II_candidate_id_number');
    expect(control).toBeTruthy();
    expect(control?.valid).toBeTrue();
    control?.setValue('P00000001');
    tick(100);
    expect(control?.valid).toBeFalse();
    control?.setValue('P00000002');
    tick(100);
    expect(control?.valid).toBeTrue();
  }));

  it('Update a contact from the contact lookup', () => {
    fixture.detectChanges();
    const committee = Contact.fromJSON({
      id: '11111-2222222-333333-444444444',
      committee_id: 'C000000001',
      name: 'Organization Name',
      type: 'ORG',
    });
    component.form1M().contact_affiliated = Contact.fromJSON({
      id: '00000-00000-00000-00000',
      committee_id: 'X000000000',
    });
    component.form1M().contact_affiliated_id = '00000-00000-00000-00000';
    (component.excludeIds as any) = createSignal(['00000-00000-00000-00000']);
    (component.excludeFecIds as any) = createSignal(['X000000000']);
    component.affiliatedContact.update({ value: committee } as SelectItem);
    expect(component.form1M().contact_affiliated_id).toEqual('11111-2222222-333333-444444444');
    expect(component.form().get('affiliated_committee_fec_id')?.value).toEqual('C000000001');
    expect(component.form().get('affiliated_committee_name')?.value).toEqual('Organization Name');
    expect(component.excludeIds()[0]).toEqual('11111-2222222-333333-444444444');
    expect(component.excludeFecIds()[0]).toEqual('C000000001');

    const candidate = Contact.fromJSON({
      id: '11111-2222222-333333-444444444',
      candidate_id: 'C000000002',
      last_name: 'Smith',
      type: 'CAN',
    });
    component.form1M().contact_candidate_I = Contact.fromJSON({
      id: '00000-00000-00000-00000',
      candidate_id: 'X000000000',
    });
    component.form1M().contact_candidate_I_id = '00000-00000-00000-00000';
    (component.excludeIds as any) = createSignal(['00000-00000-00000-00000']);
    (component.excludeFecIds as any) = createSignal(['X000000000']);
    component.candidateContacts[0].update({ value: candidate } as SelectItem);
    expect(component.form1M().contact_candidate_I?.id).toEqual('11111-2222222-333333-444444444');
    expect(component.form().get('I_candidate_id_number')?.value).toEqual('C000000002');
    expect(component.form().get('I_candidate_last_name')?.value).toEqual('Smith');
    expect(component.excludeIds()[0]).toEqual('11111-2222222-333333-444444444');
    expect(component.excludeFecIds()[0]).toEqual('C000000002');

    expect(component.candidateContacts[0].dateOfContributionField).toEqual('I_date_of_contribution');
    expect(component.candidateContacts[0].candidateId).toEqual('C000000002');
  });

  // Unit test is broken because of Async problems
  xit('Exclude ids should prepopulate when editing a F1M', () => {
    fixture.detectChanges();
    component.ngOnInit();
    expect(component.excludeFecIds()[0]).toEqual('C000000005');
    expect(component.excludeIds()[0]).toEqual('22222-22222-22222-2222222');
  });
});
