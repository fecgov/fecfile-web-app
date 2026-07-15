import { ComponentFixture, TestBed } from '@angular/core/testing';
import { testContact, testMockStore, testScheduleATransaction } from 'app/shared/utils/unit-test.utils';
import { TransactionInputComponent } from './transaction-input.component';
import { FormBuilder } from '@angular/forms';
import { ContactTypes } from 'app/shared/models/contact.model';
import { provideMockStore } from '@ngrx/store/testing';
import { ReportService } from 'app/shared/services/report.service';
import { SubscriptionFormControl } from 'app/shared/utils/subscription-form-control';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Transaction } from 'app/shared/models/transaction.model';
import { Component, viewChild } from '@angular/core';

@Component({
  imports: [TransactionInputComponent],
  standalone: true,
  template: `<app-transaction-input [transaction]="transaction" [form]="form" />`,
})
class TestHostComponent {
  component = viewChild.required(TransactionInputComponent);
  transaction?: Transaction;
  fb = new FormBuilder();
  form = this.fb.group({
    loan_balance: new SubscriptionFormControl(),
    contribution_amount: new SubscriptionFormControl(),
    payment_amount: new SubscriptionFormControl(),
    balance_at_close: new SubscriptionFormControl(),
    entity_type: new SubscriptionFormControl(),
  });
}

describe('TransactionInputComponent', () => {
  let host: TestHostComponent;
  let component: TransactionInputComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  const selectItem = {
    value: testContact(),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TransactionInputComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideMockStore(testMockStore()),
        ConfirmationService,
        ReportService,
        MessageService,
      ],
    });
    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    component = host.component();
    const transaction = testScheduleATransaction();
    transaction.transactionType.mandatoryFormValues = {
      candidate_office: 'P',
    };
    host.transaction = transaction;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('updateFormWithPrimaryContact should call emit', () => {
    vi.spyOn(component.primaryContactSelect, 'emit');
    component.updateFormWithPrimaryContact(selectItem);
    expect(component.primaryContactSelect.emit).toHaveBeenCalledWith(selectItem);
  });

  it('clearFormPrimaryContact should call emit', () => {
    vi.spyOn(component.primaryContactClear, 'emit');
    component.clearFormPrimaryContact();
    expect(component.primaryContactClear.emit).toHaveBeenCalled();
  });

  it('updateFormWithSecondaryContact should call emit', () => {
    vi.spyOn(component.secondaryContactSelect, 'emit');
    component.updateFormWithSecondaryContact(selectItem);
    expect(component.secondaryContactSelect.emit).toHaveBeenCalledWith(selectItem);
  });

  it('updateFormWithCandidateContact should call emit', () => {
    vi.spyOn(component.candidateContactSelect, 'emit');
    component.updateFormWithCandidateContact(selectItem);
    expect(component.candidateContactSelect.emit).toHaveBeenCalledWith(selectItem);
  });

  it('updateFormWithTertiaryContact should call emit', () => {
    vi.spyOn(component.tertiaryContactSelect, 'emit');
    component.updateFormWithTertiaryContact(selectItem);
    expect(component.tertiaryContactSelect.emit).toHaveBeenCalledWith(selectItem);
  });

  it('contactTypeSelected should update entity_type form control', () => {
    component.contactTypeSelected(ContactTypes.ORGANIZATION);
    expect(component.form().get('entity_type')?.value).toBe(ContactTypes.ORGANIZATION);
  });
});
