import { ComponentFixture, TestBed } from '@angular/core/testing';
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
    officeFormControlName="candidate_office"
    stateFormControlName="candidate_state"
    districtFormControlName="candidate_district"
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
    const stateFormControl = component.form.get(component.stateFormControlName);
    const districtFormControl = component.form.get(component.districtFormControlName);

    expect(stateFormControl?.value).toBeNull();
    expect(stateFormControl?.disabled).toBe(true);

    expect(districtFormControl?.value).toBeNull();
    expect(districtFormControl?.disabled).toBe(true);
  });

  it('test SENATE office', () => {
    component.form.patchValue({
      [testCandidateOfficeFormControlName]: CandidateOfficeTypes.SENATE,
    });
    const stateFormControl = component.form.get(component.stateFormControlName);
    const districtFormControl = component.form.get(component.districtFormControlName);

    expect(stateFormControl?.disabled).toBe(false);

    expect(districtFormControl?.value).toBeNull();
    expect(districtFormControl?.disabled).toBe(true);
  });

  it('test HOUSE office', () => {
    component.form.patchValue({
      [testCandidateOfficeFormControlName]: CandidateOfficeTypes.HOUSE,
    });
    component.form.patchValue({
      [testCandidateStateFormControlName]: 'FL',
    });
    const stateFormControl = component.form.get(component.stateFormControlName);
    const districtFormControl = component.form.get(component.districtFormControlName);

    expect(stateFormControl?.disabled).toBe(false);
    expect(districtFormControl?.disabled).toBe(false);

    expect(component.candidateDistrictOptions).toEqual(
      LabelUtils.getPrimeOptions(LabelUtils.getCongressionalDistrictLabels('FL')),
    );
  });

  it('adds subscription to election_code for Schedule E transactions', () => {
    host.transaction = testIndependentExpenditure;
    fixture.detectChanges();

    const electionCodeControl = component.form.get(
      host.transaction.transactionType.templateMap.election_code,
    ) as SubscriptionFormControl;
    expect(electionCodeControl.subscriptions).toHaveSize(1);
  });

  it('updates state availability for SchE transactions in Presidential Primary elections', () => {
    host.transaction = testIndependentExpenditure;
    fixture.detectChanges();

    component.form.patchValue({ [component.officeFormControlName]: CandidateOfficeTypes.PRESIDENTIAL });
    component.form.patchValue({ election_code: 'P2025' });
    expect(component.form.get(component.stateFormControlName)?.disabled).toBeFalse();

    component.form.patchValue({ election_code: 'G2025' });
    expect(component.form.get(component.stateFormControlName)?.disabled).toBeTrue();
  });

  it('updates the district field correctly while switching between states', () => {
    const stateField = component.form.get(component.stateFormControlName) as SubscriptionFormControl;
    const districtField = component.form.get(component.districtFormControlName) as SubscriptionFormControl;
    const officeField = component.form.get(component.officeFormControlName) as SubscriptionFormControl;

    officeField.setValue(CandidateOfficeTypes.HOUSE);
    expect(districtField.disabled).toBeFalse();

    stateField.setValue('AK');
    expect(districtField.value).toEqual('00');

    stateField.setValue('CA');
    expect(districtField.value).toEqual(null);

    districtField.setValue('20');
    expect(districtField.value).toEqual('20');

    stateField.setValue('AR');
    expect(districtField.value).toEqual(null);

    stateField.setValue('CA');
    districtField.setValue('02');
    stateField.setValue('AR');
    expect(districtField.value).toEqual('02');

    stateField.setValue('AK');
    expect(districtField.value).toEqual('00');

    stateField.setValue('INVALID');
    expect(districtField.value).toEqual(null);
  });
});
