import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { testTemplateMap } from 'app/shared/utils/unit-test.utils';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { ErrorMessagesComponent } from '../../error-messages/error-messages.component';
import { CandidateOfficeInputComponent } from '../candidate-office-input/candidate-office-input.component';
import { CandidateInputComponent } from './candidate-input.component';
import { SubscriptionFormControl } from 'app/shared/utils/signal-form-control';

describe('CandidateInputComponent', () => {
  let component: CandidateInputComponent;
  let fixture: ComponentFixture<CandidateInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        InputTextModule,
        SelectModule,
        ReactiveFormsModule,
        CandidateInputComponent,
        ErrorMessagesComponent,
        CandidateOfficeInputComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CandidateInputComponent);
    component = fixture.componentInstance;
    component.form = new FormGroup(
      {
        donor_candidate_fec_id: new SubscriptionFormControl(''),
        donor_candidate_last_name: new SubscriptionFormControl(''),
        donor_candidate_first_name: new SubscriptionFormControl(''),
        donor_candidate_middle_name: new SubscriptionFormControl(''),
        donor_candidate_prefix: new SubscriptionFormControl(''),
        donor_candidate_suffix: new SubscriptionFormControl(''),
        donor_candidate_office: new SubscriptionFormControl(''),
        donor_candidate_state: new SubscriptionFormControl(''),
        donor_candidate_district: new SubscriptionFormControl(''),
      },
      { updateOn: 'blur' },
    );
    component.templateMap = testTemplateMap;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
