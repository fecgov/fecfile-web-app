import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ErrorMessagesComponent } from '../../error-messages/error-messages.component';
import { getTestTransactionByType, testTemplateMap } from 'app/shared/utils/unit-test.utils';
import { CommitteeInputComponent } from './committee-input.component';
import { SchATransaction, ScheduleATransactionTypes } from 'app/shared/models/scha-transaction.model';
import { SubscriptionFormControl } from 'app/shared/utils/subscription-form-control';
import { Component, viewChild } from '@angular/core';
import { Transaction } from 'app/shared/models';

@Component({
  imports: [CommitteeInputComponent],
  standalone: true,
  template: `<app-committee-input
    [form]="form"
    [formSubmitted]="formSubmitted"
    [templateMap]="templateMap"
    [entityRole]="form.get('entity_type')?.value === ContactTypes.ORGANIZATION ? 'ORGANIZATION' : 'COMMITTEE'"
    [includeFecId]="transactionType?.hasCommitteeFecId() ?? false"
  />`,
})
class TestHostComponent {
  form: FormGroup = new FormGroup(
    {
      contributor_organization_name: new SubscriptionFormControl(''),
      donor_committee_fec_id: new SubscriptionFormControl(''),
      donor_committee_name: new SubscriptionFormControl(''),
    },
    { updateOn: 'blur' },
  );
  formSubmitted = false;
  templateMap = testTemplateMap;
  transaction: Transaction = getTestTransactionByType(ScheduleATransactionTypes.PAC_RECEIPT) as SchATransaction;
  component = viewChild.required(CommitteeInputComponent);
}

describe('CommitteeInputComponent', () => {
  let component: CommitteeInputComponent;
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputTextModule, ReactiveFormsModule, CommitteeInputComponent, ErrorMessagesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    component = host.component();

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should sync committee_name to organization_name', () => {
    host.transaction.transactionType.synchronizeOrgComNameValues = true;
    fixture.detectChanges();

    expect(component.form.get('donor_committee_name')?.value).toBe('');
    component.form.get('contributor_organization_name')?.setValue('ORG');
    expect(component.form.get('donor_committee_name')?.value).toBe('ORG');
  });
});
