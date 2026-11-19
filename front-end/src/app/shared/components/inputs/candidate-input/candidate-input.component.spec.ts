import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup } from '@angular/forms';
import { testTemplateMap } from 'app/shared/utils/unit-test.utils';

import { CandidateInputComponent } from './candidate-input.component';
import { SubscriptionFormControl } from 'app/shared/utils/subscription-form-control';
import { inputBinding, signal } from '@angular/core';
import {
  CandidateOfficeModel,
  blankCandidateOfficeModel,
} from '../../signal-form/candidate-office-form/candidate-office-form.component';

const hasCandidateOfficeInput = signal(false);
const candidateOfficeFields = signal<CandidateOfficeModel>(blankCandidateOfficeModel());

describe('CandidateInputComponent', () => {
  let component: CandidateInputComponent;
  let fixture: ComponentFixture<CandidateInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CandidateInputComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CandidateInputComponent, {
      bindings: [
        inputBinding('hasCandidateOfficeInput', hasCandidateOfficeInput),
        inputBinding('candidateOfficeFields', candidateOfficeFields),
      ],
    });
    component = fixture.componentInstance;
    component.form = new FormGroup(
      {
        donor_candidate_fec_id: new SubscriptionFormControl(''),
        donor_candidate_last_name: new SubscriptionFormControl(''),
        donor_candidate_first_name: new SubscriptionFormControl(''),
        donor_candidate_middle_name: new SubscriptionFormControl(''),
        donor_candidate_prefix: new SubscriptionFormControl(''),
        donor_candidate_suffix: new SubscriptionFormControl(''),
      },
      { updateOn: 'blur' },
    );
    component.templateMap = testTemplateMap();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
