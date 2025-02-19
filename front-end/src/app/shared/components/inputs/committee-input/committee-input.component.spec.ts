import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ErrorMessagesComponent } from '../../error-messages/error-messages.component';
import { getTestTransactionByType, testTemplateMap } from 'app/shared/utils/unit-test.utils';
import { CommitteeInputComponent } from './committee-input.component';
import { SchATransaction, ScheduleATransactionTypes } from 'app/shared/models/scha-transaction.model';
import { SubscriptionFormControl } from 'app/shared/utils/subscription-form-control';

describe('CommitteeInputComponent', () => {
  let component: CommitteeInputComponent;
  let fixture: ComponentFixture<CommitteeInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputTextModule, ReactiveFormsModule, CommitteeInputComponent, ErrorMessagesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CommitteeInputComponent);
    component = fixture.componentInstance;
    component.form = new FormGroup(
      {
        contributor_organization_name: new SubscriptionFormControl(''),
        donor_committee_fec_id: new SubscriptionFormControl(''),
        donor_committee_name: new SubscriptionFormControl(''),
      },
      { updateOn: 'blur' },
    );
    component.templateMap = testTemplateMap;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should sync committee_name to organization_name', () => {
    component.transaction = getTestTransactionByType(ScheduleATransactionTypes.PAC_RECEIPT) as SchATransaction;

    component.transaction.transactionType.synchronizeOrgComNameValues = true;

    component.ngOnInit();

    expect(component.form.get('donor_committee_name')?.value).toBe('');
    component.form.get('contributor_organization_name')?.setValue('ORG');
    expect(component.form.get('donor_committee_name')?.value).toBe('ORG');
  });
});
