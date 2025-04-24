/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { testTemplateMap } from 'app/shared/utils/unit-test.utils';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { ErrorMessagesComponent } from '../../error-messages/error-messages.component';
import { CandidateOfficeInputComponent } from '../candidate-office-input/candidate-office-input.component';
import { CandidateInputComponent } from './candidate-input.component';
import { createSignal } from '@angular/core/primitives/signals';
import { SignalFormControl } from 'app/shared/utils/signal-form-control';
import { Injector } from '@angular/core';

describe('CandidateInputComponent', () => {
  let component: CandidateInputComponent;
  let fixture: ComponentFixture<CandidateInputComponent>;
  let injector: Injector;

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

    injector = TestBed.inject(Injector);

    fixture = TestBed.createComponent(CandidateInputComponent);
    component = fixture.componentInstance;
    (component.form as any) = createSignal(
      new FormGroup(
        {
          donor_candidate_fec_id: new SignalFormControl(injector, ''),
          donor_candidate_last_name: new SignalFormControl(injector, ''),
          donor_candidate_first_name: new SignalFormControl(injector, ''),
          donor_candidate_middle_name: new SignalFormControl(injector, ''),
          donor_candidate_prefix: new SignalFormControl(injector, ''),
          donor_candidate_suffix: new SignalFormControl(injector, ''),
          donor_candidate_office: new SignalFormControl(injector, ''),
          donor_candidate_state: new SignalFormControl(injector, ''),
          donor_candidate_district: new SignalFormControl(injector, ''),
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
});
