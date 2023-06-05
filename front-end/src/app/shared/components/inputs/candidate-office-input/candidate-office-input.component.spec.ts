import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { ErrorMessagesComponent } from '../../error-messages/error-messages.component';
import { CandidateOfficeInputComponent } from './candidate-office-input.component';

describe('CandidateOfficeInputComponent', () => {
  let component: CandidateOfficeInputComponent;
  let fixture: ComponentFixture<CandidateOfficeInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CandidateOfficeInputComponent, ErrorMessagesComponent],
      imports: [InputTextModule, DropdownModule, ReactiveFormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(CandidateOfficeInputComponent);
    component = fixture.componentInstance;
    component.form = new FormGroup({
      donor_candidate_last_name: new FormControl(''),
      donor_candidate_first_name: new FormControl(''),
      donor_candidate_middle_name: new FormControl(''),
      donor_candidate_prefix: new FormControl(''),
      donor_candidate_suffix: new FormControl(''),
    });

    const testCandidateOfficeFormControlName = 'testCandidateOfficeFormControlName';
    component.form.addControl(testCandidateOfficeFormControlName, new FormControl());
    component.candidateOfficeFormControlName = testCandidateOfficeFormControlName;

    const testCandidateStateFormControlName = 'testCandidateStateFormControlName';
    component.form.addControl(testCandidateStateFormControlName, new FormControl());
    component.candidateStateFormControlName = testCandidateStateFormControlName;

    const candidateDistrictFormControlName = 'candidateDistrictFormControlName';
    component.form.addControl(candidateDistrictFormControlName, new FormControl());
    component.candidateDistrictFormControlName = candidateDistrictFormControlName;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
