/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { testContact, testMockStore, testScheduleATransaction } from 'app/shared/utils/unit-test.utils';
import { TransactionInputComponent } from './transaction-input.component';
import { FormBuilder } from '@angular/forms';
import { ContactTypes } from 'app/shared/models/contact.model';
import { provideMockStore } from '@ngrx/store/testing';
import { ReportService } from 'app/shared/services/report.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ConfirmationService } from 'primeng/api';
import { createSignal } from '@angular/core/primitives/signals';
import { SignalFormControl } from 'app/shared/utils/signal-form-control';
import { Injector } from '@angular/core';

describe('TransactionInputComponent', () => {
  let component: TransactionInputComponent;
  let fixture: ComponentFixture<TransactionInputComponent>;
  let injector: Injector;

  const selectItem = {
    value: testContact,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TransactionInputComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideMockStore(testMockStore),
        ConfirmationService,
        ReportService,
      ],
    });
    injector = TestBed.inject(Injector);
    fixture = TestBed.createComponent(TransactionInputComponent);
    component = fixture.componentInstance;
    (component.transaction as any) = createSignal(testScheduleATransaction);
    component.transaction().transactionType.mandatoryFormValues = {
      candidate_office: 'P',
    };
    component.form().setControl('loan_balance', new SignalFormControl(injector));
    component.form().setControl('contribution_amount', new SignalFormControl(injector));
    component.form().setControl('payment_amount', new SignalFormControl(injector));
    component.form().setControl('balance_at_close', new SignalFormControl(injector));
    component.ngOnInit();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('updateFormWithPrimaryContact should call emit', () => {
    spyOn(component.primaryContactSelect, 'emit');
    component.updateFormWithPrimaryContact(selectItem);
    expect(component.primaryContactSelect.emit).toHaveBeenCalledWith(selectItem);
  });

  it('updateFormWithSecondaryContact should call emit', () => {
    spyOn(component.secondaryContactSelect, 'emit');
    component.updateFormWithSecondaryContact(selectItem);
    expect(component.secondaryContactSelect.emit).toHaveBeenCalledWith(selectItem);
  });

  it('updateFormWithCandidateContact should call emit', () => {
    spyOn(component.candidateContactSelect, 'emit');
    component.updateFormWithCandidateContact(selectItem);
    expect(component.candidateContactSelect.emit).toHaveBeenCalledWith(selectItem);
  });

  it('updateFormWithTertiaryContact should call emit', () => {
    spyOn(component.tertiaryContactSelect, 'emit');
    component.updateFormWithTertiaryContact(selectItem);
    expect(component.tertiaryContactSelect.emit).toHaveBeenCalledWith(selectItem);
  });

  it('contactTypeSelected should update entity_type form control', () => {
    const fb = new FormBuilder();
    const form = fb.group({ entity_type: new SignalFormControl(injector) });
    (component.form as any) = createSignal(form);
    component.contactTypeSelected(ContactTypes.ORGANIZATION);
    expect(component.form().get('entity_type')?.value).toBe(ContactTypes.ORGANIZATION);
  });
});
