import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ErrorMessagesComponent } from '../../error-messages/error-messages.component';
import { getTestTransactionByType, testTemplateMap } from 'app/shared/utils/unit-test.utils';
import { ElectionInputComponent } from './election-input.component';
import { ScheduleETransactionTypes } from 'app/shared/models/sche-transaction.model';
import { SubscriptionFormControl } from 'app/shared/utils/subscription-form-control';
import { Transaction } from 'app/shared/models';
import { Component, viewChild } from '@angular/core';

@Component({
  imports: [ElectionInputComponent],
  standalone: true,
  template: `<app-election-input
    [transaction]="transaction"
    [form]="form"
    [formSubmitted]="formSubmitted"
    [templateMap]="templateMap"
  />`,
})
class TestHostComponent {
  form: FormGroup = new FormGroup(
    {
      election_code: new SubscriptionFormControl(''),
      election_other_description: new SubscriptionFormControl(''),
    },
    { updateOn: 'blur' },
  );
  formSubmitted = false;
  templateMap = testTemplateMap;
  transaction: Transaction = getTestTransactionByType(ScheduleETransactionTypes.MULTISTATE_INDEPENDENT_EXPENDITURE);
  component = viewChild.required(ElectionInputComponent);
}

describe('ElectionInputComponent', () => {
  let component: ElectionInputComponent;
  let host: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SelectModule,
        InputTextModule,
        InputNumberModule,
        FormsModule,
        ReactiveFormsModule,
        ElectionInputComponent,
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

  it('should update the election_code from the electionType and electionYear', () => {
    component.form.patchValue({
      electionType: 'G',
      electionYear: '2024',
    });
    expect(component.form.get('election_code')?.value).toBe('G2024');
  });

  it('should flag missing required fields', () => {
    component.form.patchValue({
      electionType: 'G',
      electionYear: '2024',
    });
    expect(component.form.status).toBe('VALID');

    component.form.patchValue({
      electionType: 'S',
      electionYear: '',
    });
    expect(component.form.status).toBe('INVALID');
  });

  it('should disable all fields', () => {
    host.form.disable();
    fixture.detectChanges();
    expect(component.form.get('electionYear')?.disabled).toBe(true);
  });
});
