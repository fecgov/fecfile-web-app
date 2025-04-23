import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ErrorMessagesComponent } from '../../error-messages/error-messages.component';
import { getTestTransactionByType, testTemplateMap } from 'app/shared/utils/unit-test.utils';
import { CommitteeInputComponent } from './committee-input.component';
import { SchATransaction, ScheduleATransactionTypes } from 'app/shared/models/scha-transaction.model';
import { SignalFormControl } from 'app/shared/utils/signal-form-control';
import { createSignal } from '@angular/core/primitives/signals';
import { Injector } from '@angular/core';

describe('CommitteeInputComponent', () => {
  let component: CommitteeInputComponent;
  let fixture: ComponentFixture<CommitteeInputComponent>;
  let injector: Injector;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputTextModule, ReactiveFormsModule, CommitteeInputComponent, ErrorMessagesComponent],
    }).compileComponents();

    injector = TestBed.inject(Injector);
    fixture = TestBed.createComponent(CommitteeInputComponent);
    component = fixture.componentInstance;
    (component.form as any) = createSignal(
      new FormGroup(
        {
          contributor_organization_name: new SignalFormControl(injector, ''),
          donor_committee_fec_id: new SignalFormControl(injector, ''),
          donor_committee_name: new SignalFormControl(injector, ''),
        },
        { updateOn: 'blur' },
      ),
    );
    (component.templateMap as any) = createSignal(testTemplateMap);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should sync committee_name to organization_name', () => {
    (component.transaction as any) = createSignal(
      getTestTransactionByType(ScheduleATransactionTypes.PAC_RECEIPT) as SchATransaction,
    );

    component.transaction()!.transactionType.synchronizeOrgComNameValues = true;

    expect(component.form().get('donor_committee_name')?.value).toBe('');
    component.form().get('contributor_organization_name')?.setValue('ORG');
    expect(component.form().get('donor_committee_name')?.value).toBe('ORG');
  });
});
