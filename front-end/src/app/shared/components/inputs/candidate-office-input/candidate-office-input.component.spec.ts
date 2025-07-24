import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CandidateOfficeTypes } from 'app/shared/models/contact.model';
import { LabelUtils } from 'app/shared/utils/label.utils';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { ErrorMessagesComponent } from '../../error-messages/error-messages.component';
import { CandidateOfficeInputComponent } from './candidate-office-input.component';
import { SubscriptionFormControl } from 'app/shared/utils/subscription-form-control';
import {
  testScheduleATransaction,
  testIndependentExpenditure,
  testTemplateMap,
} from 'app/shared/utils/unit-test.utils';
import { Component, viewChild } from '@angular/core';
import { Transaction } from 'app/shared/models';

const testCandidateOfficeFormControlName = 'testCandidateOfficeFormControlName';
const testCandidateStateFormControlName = 'testCandidateStateFormControlName';
const districtFormControlName = 'districtFormControlName';

@Component({
  imports: [CandidateOfficeInputComponent],
  standalone: true,
  template: `<app-candidate-office-input
    [form]="form"
    [formSubmitted]="formSubmitted"
    [transaction]="transaction"
    officeFormControlName="testCandidateOfficeFormControlName"
    stateFormControlName="testCandidateStateFormControlName"
    districtFormControlName="districtFormControlName"
  />`,
})
class TestHostComponent {
  form: FormGroup = new FormGroup({
    donor_candidate_last_name: new SubscriptionFormControl(''),
    donor_candidate_first_name: new SubscriptionFormControl(''),
    donor_candidate_middle_name: new SubscriptionFormControl(''),
    donor_candidate_prefix: new SubscriptionFormControl(''),
    donor_candidate_suffix: new SubscriptionFormControl(''),
    election_code: new SubscriptionFormControl(''),
    [testCandidateOfficeFormControlName]: new SubscriptionFormControl(''),
    [testCandidateStateFormControlName]: new SubscriptionFormControl(''),
    [districtFormControlName]: new SubscriptionFormControl(''),
  });

  formSubmitted = false;
  templateMap = testTemplateMap;
  transaction: Transaction = testScheduleATransaction;
  component = viewChild.required(CandidateOfficeInputComponent);
}

describe('CandidateOfficeInputComponent', () => {
  let component: CandidateOfficeInputComponent;
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        InputTextModule,
        SelectModule,
        ReactiveFormsModule,
        CandidateOfficeInputComponent,
        ErrorMessagesComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    component = host.component();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('test PRESIDENTIAL office', () => {
    component.form.patchValue({
      [testCandidateOfficeFormControlName]: CandidateOfficeTypes.PRESIDENTIAL,
    });

    expect(component.stateControl()?.value).toBeNull();
    expect(component.stateControl()?.disabled).toBe(true);

    expect(component.districtControl()?.value).toBeNull();
    expect(component.districtControl()?.disabled).toBe(true);
  });

  it('test SENATE office', () => {
    component.form.patchValue({
      [testCandidateOfficeFormControlName]: CandidateOfficeTypes.SENATE,
    });

    expect(component.stateControl()?.disabled).toBe(false);

    expect(component.districtControl()?.value).toBeNull();
    expect(component.districtControl()?.disabled).toBe(true);
  });

  it('test HOUSE office', () => {
    component.form.patchValue({
      [testCandidateOfficeFormControlName]: CandidateOfficeTypes.HOUSE,
    });
    component.form.patchValue({
      [testCandidateStateFormControlName]: 'FL',
    });

    expect(component.stateControl()?.disabled).toBe(false);
    expect(component.districtControl()?.disabled).toBe(false);

    expect(component.candidateDistrictOptions).toEqual(
      LabelUtils.getPrimeOptions(LabelUtils.getCongressionalDistrictLabels('FL')),
    );
  });

  it('adds subscription to election_code for Schedule E transactions', () => {
    host.transaction = testIndependentExpenditure;
    fixture.detectChanges();
    component.ngOnInit();

    const electionCodeControl = component.form.get(
      host.transaction.transactionType.templateMap.election_code,
    ) as SubscriptionFormControl;
    expect(electionCodeControl.subscriptions).toHaveSize(1);
  });

  it('updates state availability for SchE transactions in Presidential Primary elections', fakeAsync(() => {
    host.transaction = testIndependentExpenditure;
    fixture.detectChanges();
    component.ngOnInit();

    component.form.patchValue({ [component.officeFormControlName()]: CandidateOfficeTypes.PRESIDENTIAL });
    component.form.patchValue({ election_code: 'P2025' });
    tick();
    expect(component.stateControl()?.disabled).toBeFalse();

    component.form.patchValue({ election_code: 'G2025' });
    expect(component.stateControl()?.disabled).toBeTrue();
  }));

  it('updates the district field correctly while switching between states', () => {
    component.officeControl()?.setValue(CandidateOfficeTypes.HOUSE);
    expect(component.districtControl()?.disabled).toBeFalse();

    component.stateControl()?.setValue('AK');
    expect(component.districtControl()?.value).toEqual('00');

    component.stateControl()?.setValue('CA');
    expect(component.districtControl()?.value).toEqual(null);

    component.districtControl()?.setValue('20');
    expect(component.districtControl()?.value).toEqual('20');

    component.stateControl()?.setValue('AR');
    expect(component.districtControl()?.value).toEqual(null);

    component.stateControl()?.setValue('CA');
    component.districtControl()?.setValue('02');
    component.stateControl()?.setValue('AR');
    expect(component.districtControl()?.value).toEqual('02');

    component.stateControl()?.setValue('AK');
    expect(component.districtControl()?.value).toEqual('00');

    component.stateControl()?.setValue('INVALID');
    expect(component.districtControl()?.value).toEqual(null);
  });
});
